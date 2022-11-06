-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2022 a las 17:23:06
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tareas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_etiquetas`
--

CREATE TABLE `aw_tareas_etiquetas` (
  `IdEtiqueta` int(11) NOT NULL,
  `texto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_etiquetas`
--

INSERT INTO `aw_tareas_etiquetas` (`IdEtiqueta`, `texto`) VALUES
(1, 'Universidad'),
(2, 'AW'),
(3, 'TP'),
(4, 'Práctica'),
(5, 'Personal'),
(6, 'Académico'),
(7, 'Deporte'),
(8, 'Básico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_tareas`
--

CREATE TABLE `aw_tareas_tareas` (
  `IdTarea` int(11) NOT NULL,
  `texto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_tareas`
--

INSERT INTO `aw_tareas_tareas` (`IdTarea`, `texto`) VALUES
(1, 'Preparar prácticas AW'),
(2, 'Mirar fechas de congreso'),
(3, 'Ir al Supermercado'),
(4, 'Jugar al Fútbol'),
(5, 'Hablar con el profesor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_tareas_etiquetas`
--

CREATE TABLE `aw_tareas_tareas_etiquetas` (
  `IdTarea` int(11) NOT NULL,
  `IdEtiqueta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_tareas_etiquetas`
--

INSERT INTO `aw_tareas_tareas_etiquetas` (`IdTarea`, `IdEtiqueta`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 6),
(3, 5),
(3, 6),
(4, 5),
(4, 7),
(5, 1),
(5, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_user_tarea`
--

CREATE TABLE `aw_tareas_user_tarea` (
  `IdUser` int(11) NOT NULL,
  `IdTarea` int(11) NOT NULL,
  `hecho` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_user_tarea`
--

INSERT INTO `aw_tareas_user_tarea` (`IdUser`, `IdTarea`, `hecho`) VALUES
(1, 1, 0),
(1, 2, 1),
(1, 3, 0),
(1, 4, 0),
(1, 5, 0),
(2, 3, 0),
(2, 4, 0),
(2, 5, 0),
(3, 1, 0),
(3, 2, 0),
(3, 3, 1),
(3, 4, 0),
(4, 1, 1),
(4, 2, 0),
(4, 3, 1),
(4, 4, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aw_tareas_usuarios`
--

CREATE TABLE `aw_tareas_usuarios` (
  `IdUser` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `img` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aw_tareas_usuarios`
--

INSERT INTO `aw_tareas_usuarios` (`IdUser`, `email`, `password`, `img`) VALUES
(1, 'aitor.tilla@ucm.es', 'aitor', NULL),
(2, 'felipe.lotas@ucm.es', 'felipe', NULL),
(3, 'steve.curros@ucm.es', 'steve', NULL),
(4, 'bill.puertas@ucm.es', 'bill', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aw_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_etiquetas`
  ADD PRIMARY KEY (`IdEtiqueta`);

--
-- Indices de la tabla `aw_tareas_tareas`
--
ALTER TABLE `aw_tareas_tareas`
  ADD PRIMARY KEY (`IdTarea`);

--
-- Indices de la tabla `aw_tareas_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_tareas_etiquetas`
  ADD KEY `fk_etiqueta_tareas_etiquetas` (`IdEtiqueta`),
  ADD KEY `fk_tarea_tareas_etiquetas` (`IdTarea`);

--
-- Indices de la tabla `aw_tareas_user_tarea`
--
ALTER TABLE `aw_tareas_user_tarea`
  ADD KEY `fk_user_user_tarea` (`IdUser`),
  ADD KEY `fk_tarea_user_tarea` (`IdTarea`);

--
-- Indices de la tabla `aw_tareas_usuarios`
--
ALTER TABLE `aw_tareas_usuarios`
  ADD PRIMARY KEY (`IdUser`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aw_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_etiquetas`
  MODIFY `IdEtiqueta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `aw_tareas_tareas`
--
ALTER TABLE `aw_tareas_tareas`
  MODIFY `IdTarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `aw_tareas_usuarios`
--
ALTER TABLE `aw_tareas_usuarios`
  MODIFY `IdUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aw_tareas_tareas_etiquetas`
--
ALTER TABLE `aw_tareas_tareas_etiquetas`
  ADD CONSTRAINT `fk_etiqueta_tareas_etiquetas` FOREIGN KEY (`IdEtiqueta`) REFERENCES `aw_tareas_etiquetas` (`IdEtiqueta`),
  ADD CONSTRAINT `fk_tarea_tareas_etiquetas` FOREIGN KEY (`IdTarea`) REFERENCES `aw_tareas_tareas` (`IdTarea`);

--
-- Filtros para la tabla `aw_tareas_user_tarea`
--
ALTER TABLE `aw_tareas_user_tarea`
  ADD CONSTRAINT `fk_tarea_user_tarea` FOREIGN KEY (`IdTarea`) REFERENCES `aw_tareas_tareas` (`IdTarea`),
  ADD CONSTRAINT `fk_user_user_tarea` FOREIGN KEY (`IdUser`) REFERENCES `aw_tareas_usuarios` (`IdUser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
