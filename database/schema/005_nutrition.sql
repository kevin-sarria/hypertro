-- 005_nutrition.sql
-- Tabla de registro de nutrición y macros

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    log_date DATE NOT NULL,
    meal_name VARCHAR(80) NOT NULL,
    calories INT UNSIGNED NOT NULL,
    protein_g DECIMAL(6,1) NOT NULL,
    carbs_g DECIMAL(6,1) NOT NULL,
    fat_g DECIMAL(6,1) NOT NULL,
    notes TEXT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_nutrition_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_nutrition_user_date (user_id, log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
