-- database/smoke_test.sql
-- Valida el flujo completo de registro de series, sobrecarga progresiva y actualizacion de PRs

-- 1. Obtener ID dinamico del rol gymrat
SELECT id INTO @gymrat_role_id FROM roles WHERE name = 'gymrat' LIMIT 1;

-- 2. Insertar usuario de prueba gymrat
INSERT INTO users (role_id, email, password_hash, is_active)
VALUES (
    @gymrat_role_id,
    CONCAT('smoke_test_', UNIX_TIMESTAMP(), '_', FLOOR(RAND()*100000), '@hypertro.test'),
    '$2b$10$smoke_test_password_hash_mock',
    1
);
SET @test_user_id = LAST_INSERT_ID();

INSERT INTO user_profiles (user_id, first_name, last_name, birth_date)
VALUES (@test_user_id, 'Smoke', 'Tester', '1996-06-15');

-- 3. Obtener grupo muscular e insertar ejercicio de prueba
SELECT id INTO @muscle_group_id FROM muscle_groups LIMIT 1;

INSERT INTO exercises (name, muscle_group_id, is_active, created_by_user_id)
VALUES (CONCAT('Press Banca Smoke ', UNIX_TIMESTAMP()), @muscle_group_id, 1, @test_user_id);
SET @test_exercise_id = LAST_INSERT_ID();

-- 4. Crear dos sesiones activas para el usuario
INSERT INTO workout_sessions (user_id, status, started_at)
VALUES (@test_user_id, 'active', NOW(3));
SET @session_1_id = LAST_INSERT_ID();

INSERT INTO workout_sessions (user_id, status, started_at)
VALUES (@test_user_id, 'active', DATE_ADD(NOW(3), INTERVAL 1 SECOND));
SET @session_2_id = LAST_INSERT_ID();

SELECT @test_user_id AS created_user_id, @test_exercise_id AS created_exercise_id, @session_1_id AS session_1, @session_2_id AS session_2;

-- 5. Registrar primera serie en Sesion 1 (100 kg x 5 reps)
-- Debe insertar primer PR en personal_records (100 kg x 5 reps)
CALL sp_log_exercise_set(
    @test_user_id,
    @session_1_id,
    @test_exercise_id,
    1,
    100.00,
    5,
    2,
    8.0,
    'good',
    120
);

-- 6. Finalizar la Sesion 1
UPDATE workout_sessions
SET status = 'finished', ended_at = NOW(3)
WHERE id = @session_1_id;

-- 7. Registrar serie en Sesion 2 (105 kg x 3 reps)
-- En el segundo result set debe retornar max_weight_kg=100.00 y reps_at_max_weight=5 (marca previa de sesion 1)
-- Ademas actualiza personal_records a 105.00 kg x 3 reps
CALL sp_log_exercise_set(
    @test_user_id,
    @session_2_id,
    @test_exercise_id,
    1,
    105.00,
    3,
    1,
    9.0,
    'great',
    180
);

-- 8. Validar el estado final de personal_records (debe tener max_weight_kg = 105.00)
SELECT 
    user_id,
    exercise_id,
    max_weight_kg,
    reps_at_max,
    achieved_at,
    set_log_id,
    CASE 
        WHEN max_weight_kg = 105.00 AND reps_at_max = 3 THEN 'PASSED: PR registrado correctamente con 105kg x 3 reps'
        ELSE 'FAILED: El PR no coincide con 105kg x 3 reps'
    END AS verification_result
FROM personal_records
WHERE user_id = @test_user_id AND exercise_id = @test_exercise_id;

-- 9. Mostrar historial de series registradas para el ejercicio
SELECT 
    id AS set_log_id,
    session_id,
    set_number,
    weight_kg,
    reps,
    rpe,
    rir,
    feeling,
    is_personal_record,
    logged_at
FROM set_logs
WHERE user_id = @test_user_id AND exercise_id = @test_exercise_id
ORDER BY id ASC;
