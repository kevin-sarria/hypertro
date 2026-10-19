-- 006_views.sql
-- Vistas analíticas para progresión de usuarios y sobrecarga progresiva
--
-- NOTA DE ARQUITECTURA Y RENDIMIENTO:
-- MySQL 8.0 no soporta vistas materializadas ni vistas indexadas nativamente.
-- El rendimiento óptimo de las consultas analíticas sobre esta vista se garantiza mediante:
-- 1. Los índices compuestos en `set_logs`: `(user_id, exercise_id, logged_at DESC)` y `(session_id, exercise_id, set_number)`.
-- 2. La tabla física transaccional `personal_records` que mantiene el récord histórico máximo sin necesidad de agregaciones pesadas en caliente.

CREATE OR REPLACE VIEW v_user_exercise_progress AS
SELECT 
    sl.user_id,
    sl.exercise_id,
    DATE(sl.logged_at) AS session_date,
    MAX(sl.weight_kg) AS max_weight_kg,
    SUM(sl.weight_kg * sl.reps) AS total_volume,
    COUNT(sl.id) AS total_sets,
    SUM(sl.reps) AS total_reps
FROM set_logs sl
GROUP BY 
    sl.user_id,
    sl.exercise_id,
    DATE(sl.logged_at);
