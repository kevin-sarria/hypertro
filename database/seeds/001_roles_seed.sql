-- 001_roles_seed.sql
-- Inserción inicial de roles del sistema, factores de actividad y catálogos básicos

INSERT INTO roles (id, name, description) VALUES
(1, 'gymrat', 'Atleta o usuario final enfocado en su entrenamiento y nutrición personal'),
(2, 'coach', 'Entrenador que gestiona squads, asigna rutinas y supervisa atletas'),
(3, 'admin', 'Administrador de plataforma con acceso global')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO activity_factors (id, name, multiplier) VALUES
(1, 'Sedentario (poco o ningún ejercicio)', 1.200),
(2, 'Ligeramente activo (1-3 días a la semana)', 1.375),
(3, 'Moderadamente activo (3-5 días a la semana)', 1.550),
(4, 'Muy activo (6-7 días a la semana)', 1.725),
(5, 'Extremadamente activo (atletas / trabajo físico)', 1.900)
ON DUPLICATE KEY UPDATE multiplier = VALUES(multiplier);

INSERT INTO muscle_groups (id, name) VALUES
(1, 'Pecho'),
(2, 'Espalda'),
(3, 'Cuádriceps'),
(4, 'Isquiosurales / Femorales'),
(5, 'Glúteos'),
(6, 'Hombros'),
(7, 'Bíceps'),
(8, 'Tríceps'),
(9, 'Gemelos'),
(10, 'Abdomen / Core')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO machine_types (id, name) VALUES
(1, 'Barra olímpica'),
(2, 'Mancuernas'),
(3, 'Polea / Cable'),
(4, 'Máquina de palanca / Placas'),
(5, 'Peso corporal / Calistenia'),
(6, 'Smith Machine / Multipower')
ON DUPLICATE KEY UPDATE name = VALUES(name);
