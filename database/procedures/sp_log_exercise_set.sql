-- sp_log_exercise_set.sql
-- Procedimiento almacenado transaccional para registro de series, cálculo de PRs y comparación con sesión previa

DROP PROCEDURE IF EXISTS sp_log_exercise_set;

DELIMITER $$

CREATE PROCEDURE sp_log_exercise_set(
    IN p_user_id BIGINT UNSIGNED,
    IN p_session_id BIGINT UNSIGNED,
    IN p_exercise_id BIGINT UNSIGNED,
    IN p_set_number SMALLINT UNSIGNED,
    IN p_weight_kg DECIMAL(6,2),
    IN p_reps SMALLINT UNSIGNED,
    IN p_rir TINYINT UNSIGNED,
    IN p_rpe DECIMAL(3,1),
    IN p_feeling VARCHAR(10),
    IN p_rest_seconds SMALLINT UNSIGNED
)
proc_block: BEGIN
    DECLARE v_session_exists INT DEFAULT 0;
    DECLARE v_new_set_id BIGINT UNSIGNED DEFAULT 0;
    DECLARE v_current_pr_weight DECIMAL(6,2) DEFAULT NULL;
    DECLARE v_current_pr_reps SMALLINT UNSIGNED DEFAULT NULL;
    DECLARE v_is_pr BOOLEAN DEFAULT 0;
    DECLARE v_prev_session_id BIGINT UNSIGNED DEFAULT NULL;

    -- Manejador de excepciones: rollback y propagación del error
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Validar sesión activa y pertenencia al usuario con bloqueo pesimista
    SELECT COUNT(*)
    INTO v_session_exists
    FROM workout_sessions
    WHERE id = p_session_id 
      AND user_id = p_user_id 
      AND status = 'active'
    FOR UPDATE;

    IF v_session_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La sesion de entrenamiento no existe, no esta activa o no pertenece al usuario';
    END IF;

    -- 2. Insertar la serie en set_logs
    INSERT INTO set_logs (
        session_id,
        user_id,
        exercise_id,
        set_number,
        weight_kg,
        reps,
        rir,
        rpe,
        feeling,
        rest_seconds,
        is_personal_record,
        logged_at
    ) VALUES (
        p_session_id,
        p_user_id,
        p_exercise_id,
        p_set_number,
        p_weight_kg,
        p_reps,
        p_rir,
        p_rpe,
        p_feeling,
        p_rest_seconds,
        0,
        NOW(3)
    );

    SET v_new_set_id = LAST_INSERT_ID();

    -- 3. Cálculo de PR transaccional con bloqueo pesimista
    SELECT max_weight_kg, reps_at_max
    INTO v_current_pr_weight, v_current_pr_reps
    FROM personal_records
    WHERE user_id = p_user_id AND exercise_id = p_exercise_id
    FOR UPDATE;

    IF v_current_pr_weight IS NULL THEN
        -- Primer registro histórico de este ejercicio para el usuario
        SET v_is_pr = 1;
        INSERT INTO personal_records (
            user_id,
            exercise_id,
            max_weight_kg,
            reps_at_max,
            achieved_at,
            set_log_id
        ) VALUES (
            p_user_id,
            p_exercise_id,
            p_weight_kg,
            p_reps,
            NOW(3),
            v_new_set_id
        );
    ELSEIF p_weight_kg > v_current_pr_weight OR (p_weight_kg = v_current_pr_weight AND p_reps > v_current_pr_reps) THEN
        -- Superó peso o mantuvo peso con más repeticiones
        SET v_is_pr = 1;
        UPDATE personal_records
        SET max_weight_kg = p_weight_kg,
            reps_at_max = p_reps,
            achieved_at = NOW(3),
            set_log_id = v_new_set_id
        WHERE user_id = p_user_id AND exercise_id = p_exercise_id;
    END IF;

    IF v_is_pr = 1 THEN
        UPDATE set_logs
        SET is_personal_record = 1
        WHERE id = v_new_set_id;
    END IF;

    COMMIT;

    -- 4. Result set 1: La serie registrada con flag de PR
    SELECT 
        id,
        session_id,
        user_id,
        exercise_id,
        set_number,
        weight_kg,
        reps,
        rir,
        rpe,
        feeling,
        rest_seconds,
        is_personal_record,
        logged_at,
        created_at,
        updated_at
    FROM set_logs
    WHERE id = v_new_set_id;

    -- 5. Result set 2: Resumen de la sesión previa más reciente
    SELECT session_id
    INTO v_prev_session_id
    FROM set_logs
    WHERE user_id = p_user_id
      AND exercise_id = p_exercise_id
      AND session_id != p_session_id
    ORDER BY logged_at DESC
    LIMIT 1;

    IF v_prev_session_id IS NOT NULL THEN
        SELECT 
            sl.session_id AS previous_session_id,
            DATE(sl.logged_at) AS previous_session_date,
            sl.weight_kg AS max_weight_kg,
            sl.reps AS reps_at_max_weight
        FROM set_logs sl
        WHERE sl.session_id = v_prev_session_id
          AND sl.exercise_id = p_exercise_id
        ORDER BY sl.weight_kg DESC, sl.reps DESC
        LIMIT 1;
    ELSE
        SELECT 
            CAST(NULL AS UNSIGNED) AS previous_session_id,
            CAST(NULL AS DATE) AS previous_session_date,
            CAST(NULL AS DECIMAL(6,2)) AS max_weight_kg,
            CAST(NULL AS UNSIGNED) AS reps_at_max_weight;
    END IF;

END proc_block$$

DELIMITER ;
