-- 004_workouts.sql
-- Tablas de rutinas, sesiones de entrenamiento, series y records personales

CREATE TABLE IF NOT EXISTS routines (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_coach_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_routines_coach FOREIGN KEY (owner_coach_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS routine_exercises (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT UNSIGNED NOT NULL,
    exercise_id BIGINT UNSIGNED NOT NULL,
    position SMALLINT UNSIGNED NOT NULL,
    target_sets SMALLINT UNSIGNED NOT NULL,
    target_reps VARCHAR(50) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_routine_exercises_routine FOREIGN KEY (routine_id) REFERENCES routines (id) ON DELETE CASCADE,
    CONSTRAINT fk_routine_exercises_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS routine_assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    routine_id BIGINT UNSIGNED NOT NULL,
    squad_id BIGINT UNSIGNED NULL,
    user_id BIGINT UNSIGNED NULL,
    assigned_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_routine_assignments_routine FOREIGN KEY (routine_id) REFERENCES routines (id) ON DELETE CASCADE,
    CONSTRAINT fk_routine_assignments_squad FOREIGN KEY (squad_id) REFERENCES squads (id) ON DELETE CASCADE,
    CONSTRAINT fk_routine_assignments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS workout_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    routine_id BIGINT UNSIGNED NULL,
    started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ended_at DATETIME(3) NULL,
    notes TEXT NULL,
    status ENUM('active', 'finished') NOT NULL DEFAULT 'active',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_workout_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_workout_sessions_routine FOREIGN KEY (routine_id) REFERENCES routines (id) ON DELETE SET NULL,
    INDEX idx_sessions_user_started (user_id, started_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS set_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    exercise_id BIGINT UNSIGNED NOT NULL,
    set_number SMALLINT UNSIGNED NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    reps SMALLINT UNSIGNED NOT NULL,
    rir TINYINT UNSIGNED NULL,
    rpe DECIMAL(3,1) NULL,
    feeling ENUM('bad', 'ok', 'good', 'great') NULL,
    rest_seconds SMALLINT UNSIGNED NULL,
    is_personal_record BOOLEAN NOT NULL DEFAULT 0,
    logged_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT chk_set_logs_weight CHECK (weight_kg >= 0),
    CONSTRAINT chk_set_logs_reps CHECK (reps > 0),
    CONSTRAINT chk_set_logs_rir CHECK (rir IS NULL OR (rir BETWEEN 0 AND 10)),
    CONSTRAINT chk_set_logs_rpe CHECK (rpe IS NULL OR (rpe >= 1.0 AND rpe <= 10.0)),
    CONSTRAINT fk_set_logs_session FOREIGN KEY (session_id) REFERENCES workout_sessions (id) ON DELETE CASCADE,
    CONSTRAINT fk_set_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_set_logs_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE RESTRICT,
    INDEX idx_set_logs_user_exercise_logged (user_id, exercise_id, logged_at DESC),
    CONSTRAINT uq_session_exercise_set UNIQUE (session_id, exercise_id, set_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS personal_records (
    user_id BIGINT UNSIGNED NOT NULL,
    exercise_id BIGINT UNSIGNED NOT NULL,
    max_weight_kg DECIMAL(6,2) NOT NULL,
    reps_at_max SMALLINT UNSIGNED NOT NULL,
    achieved_at DATETIME(3) NOT NULL,
    set_log_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id, exercise_id),
    CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE RESTRICT,
    CONSTRAINT fk_pr_set_log FOREIGN KEY (set_log_id) REFERENCES set_logs (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
