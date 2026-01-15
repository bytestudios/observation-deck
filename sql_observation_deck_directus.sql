# ************************************************************
# Sequel Ace SQL dump
# Version 20062
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 8.0.37-0ubuntu0.23.10.2)
# Database: directus
# Generation Time: 2026-01-15 19:48:29 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table Dimensions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Dimensions`;

CREATE TABLE `Dimensions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `sort` int DEFAULT NULL,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '0',
  `framework_id` int unsigned DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Framework` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `dimensions_user_created_foreign` (`user_created`),
  KEY `dimensions_framework_id_foreign` (`framework_id`),
  KEY `dimensions_framework_foreign` (`Framework`),
  CONSTRAINT `dimensions_framework_foreign` FOREIGN KEY (`Framework`) REFERENCES `Frameworks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `dimensions_framework_id_foreign` FOREIGN KEY (`framework_id`) REFERENCES `Frameworks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `dimensions_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Dimensions` WRITE;
/*!40000 ALTER TABLE `Dimensions` DISABLE KEYS */;

INSERT INTO `Dimensions` (`id`, `status`, `sort`, `user_created`, `date_created`, `name`, `is_public`, `framework_id`, `color`, `Framework`)
VALUES
	(1,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-04-03 18:46:06','Making Connections',1,1,'#7A2E55',1),
	(2,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-04-03 18:57:53','Initiative & Intentionality',1,1,'#D05C28',1),
	(3,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:11:53','Problem Solving & Critical Thinking',1,1,'#71A341',1),
	(4,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:12:15','Creativity & Self Expression',1,1,'#1A6577',1),
	(5,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:14:03','Social Emotional Engagement',1,1,'#77787B',1);

/*!40000 ALTER TABLE `Dimensions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_activity
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_activity`;

CREATE TABLE `directus_activity` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `action` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `origin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_activity_collection_foreign` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_activity` WRITE;
/*!40000 ALTER TABLE `directus_activity` DISABLE KEYS */;

INSERT INTO `directus_activity` (`id`, `action`, `user`, `timestamp`, `ip`, `user_agent`, `collection`, `item`, `comment`, `origin`)
VALUES
	(1,'login','fc559882-2ab5-48cf-b075-dbca750a5f50','2025-05-16 21:41:58','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36','directus_users','fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'https://madpl.bytestudios.com'),
	(2,'login','fc559882-2ab5-48cf-b075-dbca750a5f50','2026-01-15 19:20:39','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','directus_users','fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'https://madpl.bytestudios.com');

/*!40000 ALTER TABLE `directus_activity` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_collections
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_collections`;

CREATE TABLE `directus_collections` (
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `display_template` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `singleton` tinyint(1) NOT NULL DEFAULT '0',
  `translations` json DEFAULT NULL,
  `archive_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archive_app_filter` tinyint(1) NOT NULL DEFAULT '1',
  `archive_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unarchive_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountability` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_duplication_fields` json DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collapse` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `preview_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `versioning` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`collection`),
  KEY `directus_collections_group_foreign` (`group`),
  CONSTRAINT `directus_collections_group_foreign` FOREIGN KEY (`group`) REFERENCES `directus_collections` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_collections` WRITE;
/*!40000 ALTER TABLE `directus_collections` DISABLE KEYS */;

INSERT INTO `directus_collections` (`collection`, `icon`, `note`, `display_template`, `hidden`, `singleton`, `translations`, `archive_field`, `archive_app_filter`, `archive_value`, `unarchive_value`, `sort_field`, `accountability`, `color`, `item_duplication_fields`, `sort`, `group`, `collapse`, `preview_url`, `versioning`)
VALUES
	('Dimensions',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft','sort','all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Frameworks',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft','sort','all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Indicators',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft',NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Institutions',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft',NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Locations',NULL,NULL,'{{name}}{{institution_id.Name}}',0,0,NULL,'status',1,'archived','draft',NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Observations',NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Partners',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft',NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0),
	('Sessions',NULL,NULL,NULL,0,0,NULL,'status',1,'archived','draft',NULL,'all',NULL,NULL,NULL,NULL,'open',NULL,0);

/*!40000 ALTER TABLE `directus_collections` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_dashboards
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_dashboards`;

CREATE TABLE `directus_dashboards` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dashboard',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_dashboards_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_dashboards_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_extensions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_extensions`;

CREATE TABLE `directus_extensions` (
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_fields
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_fields`;

CREATE TABLE `directus_fields` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `special` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interface` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `options` json DEFAULT NULL,
  `display` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_options` json DEFAULT NULL,
  `readonly` tinyint(1) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `sort` int unsigned DEFAULT NULL,
  `width` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'full',
  `translations` json DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `conditions` json DEFAULT NULL,
  `required` tinyint(1) DEFAULT '0',
  `group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `validation` json DEFAULT NULL,
  `validation_message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `directus_fields_collection_foreign` (`collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_fields` WRITE;
/*!40000 ALTER TABLE `directus_fields` DISABLE KEYS */;

INSERT INTO `directus_fields` (`id`, `collection`, `field`, `special`, `interface`, `options`, `display`, `display_options`, `readonly`, `hidden`, `sort`, `width`, `translations`, `note`, `conditions`, `required`, `group`, `validation`, `validation_message`)
VALUES
	(1,'Frameworks','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(2,'Frameworks','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\"}, {\"text\": \"$t:draft\", \"value\": \"draft\"}, {\"text\": \"$t:archived\", \"value\": \"archived\"}]}','labels','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\", \"background\": \"var(--primary)\", \"foreground\": \"#FFFFFF\"}, {\"text\": \"$t:draft\", \"value\": \"draft\", \"background\": \"#D3DAE4\", \"foreground\": \"#18222F\"}, {\"text\": \"$t:archived\", \"value\": \"archived\", \"background\": \"var(--warning)\", \"foreground\": \"#FFFFFF\"}], \"showAsDot\": true}',0,0,6,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(3,'Frameworks','sort',NULL,'input',NULL,NULL,NULL,0,1,7,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(4,'Frameworks','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,8,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(5,'Frameworks','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,9,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(6,'Frameworks','name',NULL,'input',NULL,NULL,NULL,0,0,3,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(7,'Frameworks','is_public','cast-boolean','boolean',NULL,NULL,NULL,0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(8,'Dimensions','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(9,'Dimensions','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\"}, {\"text\": \"$t:draft\", \"value\": \"draft\"}, {\"text\": \"$t:archived\", \"value\": \"archived\"}]}','labels','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\", \"background\": \"var(--primary)\", \"foreground\": \"#FFFFFF\"}, {\"text\": \"$t:draft\", \"value\": \"draft\", \"background\": \"#D3DAE4\", \"foreground\": \"#18222F\"}, {\"text\": \"$t:archived\", \"value\": \"archived\", \"background\": \"var(--warning)\", \"foreground\": \"#FFFFFF\"}], \"showAsDot\": true}',0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(10,'Dimensions','sort',NULL,'input',NULL,NULL,NULL,0,1,8,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(11,'Dimensions','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,9,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(12,'Dimensions','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,10,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(13,'Dimensions','name',NULL,'input',NULL,NULL,NULL,0,0,2,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(14,'Dimensions','is_public','cast-boolean','boolean',NULL,NULL,NULL,0,0,7,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(17,'Indicators','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(18,'Indicators','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\"}, {\"text\": \"$t:draft\", \"value\": \"draft\"}, {\"text\": \"$t:archived\", \"value\": \"archived\"}]}','labels','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\", \"background\": \"var(--primary)\", \"foreground\": \"#FFFFFF\"}, {\"text\": \"$t:draft\", \"value\": \"draft\", \"background\": \"#D3DAE4\", \"foreground\": \"#18222F\"}, {\"text\": \"$t:archived\", \"value\": \"archived\", \"background\": \"var(--warning)\", \"foreground\": \"#FFFFFF\"}], \"showAsDot\": true}',0,0,6,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(19,'Indicators','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,7,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(20,'Indicators','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,8,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(23,'Indicators','is_public','cast-boolean','boolean',NULL,NULL,NULL,0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(24,'Institutions','id',NULL,'input',NULL,NULL,NULL,1,1,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(25,'Institutions','Name',NULL,'input',NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(27,'Frameworks','institution','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}','related-values','{\"template\": \"{{Name}}\"}',0,0,2,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(28,'directus_users','institution','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}','related-values','{\"template\": \"{{Name}}\"}',0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(29,'Sessions','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(30,'Sessions','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,20,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(31,'Sessions','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,21,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(32,'Sessions','id',NULL,'input',NULL,NULL,NULL,1,1,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(33,'Sessions','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,NULL,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(34,'Sessions','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,NULL,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(35,'Sessions','id',NULL,'input',NULL,NULL,NULL,1,1,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(36,'Sessions','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,NULL,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(37,'Sessions','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,NULL,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(39,'Locations','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(40,'Locations','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\"}, {\"text\": \"$t:draft\", \"value\": \"draft\"}, {\"text\": \"$t:archived\", \"value\": \"archived\"}]}','labels','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\", \"background\": \"var(--primary)\", \"foreground\": \"#FFFFFF\"}, {\"text\": \"$t:draft\", \"value\": \"draft\", \"background\": \"#D3DAE4\", \"foreground\": \"#18222F\"}, {\"text\": \"$t:archived\", \"value\": \"archived\", \"background\": \"var(--warning)\", \"foreground\": \"#FFFFFF\"}], \"showAsDot\": true}',0,0,6,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(41,'Locations','user_created','user-created','select-dropdown-m2o','{\"template\": \"{{avatar.$thumbnail}} {{first_name}} {{last_name}}\"}','user',NULL,1,1,7,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(42,'Locations','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,8,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(43,'Locations','name',NULL,'input',NULL,NULL,NULL,0,0,2,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(44,'Locations','institution_id','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}','related-values','{\"template\": \"{{Name}}\"}',0,0,3,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(46,'Sessions','name',NULL,'input',NULL,NULL,NULL,0,0,2,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(47,'Sessions','framework_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}\"}','related-values','{\"template\": \"{{name}}\"}',0,0,8,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(48,'Sessions','date',NULL,'datetime',NULL,NULL,NULL,0,0,7,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(49,'Frameworks','description',NULL,'input-rich-text-html','{\"toolbar\": [\"bold\", \"italic\", \"underline\", \"numlist\", \"bullist\", \"removeformat\", \"copy\", \"paste\", \"customLink\", \"code\", \"fullscreen\"]}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(50,'Sessions','institution_id','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}',NULL,NULL,0,0,9,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(51,'Sessions','location_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}\"}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(52,'Sessions','user_id','m2o','select-dropdown-m2o','{\"template\": \"{{first_name}} {{last_name}}\"}',NULL,NULL,0,0,6,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(53,'Partners','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(54,'Partners','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\"}, {\"text\": \"$t:draft\", \"value\": \"draft\"}, {\"text\": \"$t:archived\", \"value\": \"archived\"}]}','labels','{\"choices\": [{\"text\": \"$t:published\", \"value\": \"published\", \"background\": \"var(--primary)\", \"foreground\": \"#FFFFFF\"}, {\"text\": \"$t:draft\", \"value\": \"draft\", \"background\": \"#D3DAE4\", \"foreground\": \"#18222F\"}, {\"text\": \"$t:archived\", \"value\": \"archived\", \"background\": \"var(--warning)\", \"foreground\": \"#FFFFFF\"}], \"showAsDot\": true}',0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(56,'Locations','user_id','m2o','select-dropdown-m2o','{\"template\": \"{{first_name}} {{last_name}}\"}',NULL,NULL,0,0,8,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(58,'Partners','institution_id','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(59,'Sessions','partner_id','m2o','select-dropdown-m2o','{\"template\": \"{{nane}}\"}',NULL,NULL,0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(60,'Sessions','complete','cast-boolean','boolean',NULL,NULL,NULL,0,0,19,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(61,'Partners','name',NULL,'input',NULL,NULL,NULL,0,0,2,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(62,'Dimensions','framework_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}\"}','related-values','{\"template\": \"{{name}}\"}',0,0,3,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(63,'Indicators','dimension_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}\"}','related-values','{\"template\": \"{{name}}\"}',0,0,3,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(65,'Indicators','name',NULL,'input',NULL,NULL,NULL,0,0,2,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(78,'Observations','id',NULL,'input',NULL,NULL,NULL,1,1,1,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(79,'Observations','date_created','date-created','datetime',NULL,'datetime','{\"relative\": true}',1,1,12,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(80,'Observations','date_updated','date-updated','datetime',NULL,'datetime','{\"relative\": true}',1,1,13,'half',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(81,'Observations','user_id','m2o','select-dropdown-m2o','{\"template\": \"{{first_name}} {{last_name}}\"}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(82,'Observations','note',NULL,'input-multiline',NULL,NULL,NULL,0,0,5,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(83,'Observations','image','file','file-image',NULL,NULL,NULL,0,0,6,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(84,'Observations','dimension_id','m2o','select-dropdown-m2o','{\"template\": \"{{framework_id.name}}: {{name}}\"}','related-values','{\"template\": \"{{framework_id.name}}-{{name}}\"}',0,0,8,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(85,'Observations','indicator_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}\"}','related-values','{\"template\": \"{{name}}\"}',0,0,9,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(86,'Observations','institution_id','m2o','select-dropdown-m2o','{\"template\": \"{{Name}}\"}',NULL,NULL,0,0,11,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(87,'Observations','session_id','m2o','select-dropdown-m2o','{\"template\": \"{{name}}-{{date}}\"}','related-values','{\"template\": \"{{name}}\"}',0,0,2,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(88,'Observations','is_starred','cast-boolean','boolean',NULL,NULL,NULL,0,0,10,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(89,'Observations','attendee_code',NULL,'input',NULL,NULL,NULL,0,0,7,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(91,'Dimensions','color',NULL,'select-color','{\"presets\": [{\"name\": \"YG1\", \"color\": \"#548200\"}, {\"name\": \"YG2\", \"color\": \"#FFEB08\"}, {\"name\": \"YG3\", \"color\": \"#FFBD00\"}, {\"name\": \"YG4\", \"color\": \"#96CA14\"}, {\"name\": \"YG5\", \"color\": \"#285606\"}, {\"name\": \"BP1\", \"color\": \"#0000B8\"}, {\"name\": \"BP2\", \"color\": \"#027FFE\"}, {\"name\": \"BP3\", \"color\": \"#800080\"}, {\"name\": \"BP4\", \"color\": \"#7851A9\"}, {\"name\": \"BP5\", \"color\": \"#7C00C3\"}, {\"name\": \"OR1\", \"color\": \"#69140E\"}, {\"name\": \"OR2\", \"color\": \"#FF6517\"}, {\"name\": \"OR3\", \"color\": \"#FFB505\"}, {\"name\": \"OR4\", \"color\": \"#C4041E\"}, {\"name\": \"OR5\", \"color\": \"#FF9100\"}]}',NULL,NULL,0,0,6,'full',NULL,NULL,NULL,1,NULL,NULL,NULL),
	(92,'Institutions','session_slider_1_question',NULL,'input',NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(93,'Institutions','session_slider_1_label_low',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(94,'Institutions','session_slider_1_label_medium',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(95,'Institutions','session_slider_1_label_high',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(96,'Institutions','session_slider_2_question',NULL,'input',NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(97,'Institutions','session_slider_2_label_low',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(98,'Institutions','session_slider_2_label_medium',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(99,'Institutions','session_slider_2_label_high',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(100,'Institutions','session_slider_3_question',NULL,'input',NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(101,'Institutions','session_slider_3_label_low',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(102,'Institutions','session_slider_3_label_medium',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(103,'Institutions','session_slider_3_label_high',NULL,'input','{\"softLength\": 15}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(104,'Sessions','slider_1',NULL,'slider','{\"maxValue\": 100, \"minValue\": 1}',NULL,NULL,0,0,12,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(105,'Sessions','slider_2',NULL,'slider','{\"maxValue\": 100, \"minValue\": 1}',NULL,NULL,0,0,13,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(106,'Sessions','slider_3',NULL,'slider','{\"maxValue\": 100, \"minValue\": 1}',NULL,NULL,0,0,14,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(107,'Sessions','feedback',NULL,'input-multiline',NULL,NULL,NULL,0,0,15,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(108,'Sessions','challenges',NULL,'input-multiline',NULL,NULL,NULL,0,0,16,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(109,'Sessions','successes',NULL,'input-multiline',NULL,NULL,NULL,0,0,17,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(110,'Sessions','summary',NULL,'input-multiline',NULL,NULL,NULL,0,0,18,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(111,'Sessions','image','file','file-image',NULL,NULL,NULL,0,0,3,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(112,'Institutions','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"Published\", \"value\": \"published\"}, {\"text\": \"Draft\", \"value\": \"draft\"}, {\"text\": \"Archived\", \"value\": \"archived\"}]}',NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(113,'Sessions','status',NULL,'select-dropdown','{\"choices\": [{\"text\": \"Published\", \"value\": \"published\"}, {\"text\": \"Draft\", \"value\": \"draft\"}, {\"text\": \"Archived\", \"value\": \"archived\"}]}',NULL,NULL,0,0,22,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(115,'Sessions','attendance_count',NULL,'input','{\"min\": 0}',NULL,NULL,0,0,10,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(121,'Observations','Session','m2o','select-dropdown-m2o','{\"template\": \"{{id}}: {{name}}\"}',NULL,NULL,0,0,3,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(122,'Sessions','Observations','o2m','list-o2m',NULL,NULL,NULL,0,0,23,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(123,'Indicators','Dimension','m2o','select-dropdown-m2o','{\"template\": \"{{id}}: {{name}}\"}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(124,'Dimensions','Indicators','o2m','list-o2m','{\"template\": \"{{id}}: {{name}}\"}',NULL,NULL,0,0,11,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(125,'Dimensions','Framework','m2o','select-dropdown-m2o','{\"template\": \"{{id}}: {{name}}\"}',NULL,NULL,0,0,4,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(126,'Frameworks','Dimensions','o2m','list-o2m',NULL,NULL,NULL,0,0,NULL,'full',NULL,NULL,NULL,0,NULL,NULL,NULL),
	(127,'Sessions','primary_audience',NULL,'select-dropdown','{\"choices\": [{\"text\": \"Children 0-5\", \"value\": \"Children 0-5\"}, {\"text\": \"Children 6-11\", \"value\": \"Children 6-11\"}, {\"text\": \"Young Adult 12-18\", \"value\": \"Young Adult 12-18\"}, {\"text\": \"Adult 19+\", \"value\": \"Adult 19+\"}, {\"text\": \"General interest (all ages)\", \"value\": \"General interest (all ages)\"}], \"allowNone\": true}',NULL,NULL,0,0,11,'full',NULL,NULL,NULL,0,NULL,NULL,NULL);

/*!40000 ALTER TABLE `directus_fields` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_files`;

CREATE TABLE `directus_files` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `storage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename_disk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename_download` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `folder` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `charset` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filesize` bigint DEFAULT NULL,
  `width` int unsigned DEFAULT NULL,
  `height` int unsigned DEFAULT NULL,
  `duration` int unsigned DEFAULT NULL,
  `embed` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tags` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_files_uploaded_by_foreign` (`uploaded_by`),
  KEY `directus_files_modified_by_foreign` (`modified_by`),
  KEY `directus_files_folder_foreign` (`folder`),
  CONSTRAINT `directus_files_folder_foreign` FOREIGN KEY (`folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_files_modified_by_foreign` FOREIGN KEY (`modified_by`) REFERENCES `directus_users` (`id`),
  CONSTRAINT `directus_files_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_files` WRITE;
/*!40000 ALTER TABLE `directus_files` DISABLE KEYS */;

INSERT INTO `directus_files` (`id`, `storage`, `filename_disk`, `filename_download`, `title`, `type`, `folder`, `uploaded_by`, `uploaded_on`, `modified_by`, `modified_on`, `charset`, `filesize`, `width`, `height`, `duration`, `embed`, `description`, `location`, `tags`, `metadata`)
VALUES
	('2e71bfb2-4350-4691-8288-607f6e86b722','local','2e71bfb2-4350-4691-8288-607f6e86b722.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:25:39',NULL,'2023-08-30 19:25:54',NULL,2150595,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('313f8b28-6421-4682-a133-ce70b700a180','local','313f8b28-6421-4682-a133-ce70b700a180.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:15:57',NULL,'2023-08-30 19:16:09',NULL,2223049,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('5e291a45-7a29-447b-b37c-53da25aab84e','local','5e291a45-7a29-447b-b37c-53da25aab84e.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:36:40',NULL,'2023-08-30 19:36:48',NULL,2123698,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('71deaa39-b1bc-488d-b6e7-183775e28be6','local','71deaa39-b1bc-488d-b6e7-183775e28be6.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:11:17',NULL,'2023-08-30 19:11:42',NULL,2559414,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('7829567a-fa31-4cc7-87a1-913bba76f4ec','local','7829567a-fa31-4cc7-87a1-913bba76f4ec.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:17:59',NULL,'2023-08-30 19:18:12',NULL,2563954,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('82507d74-36c3-4f93-9d6a-aa98eb663153','local','82507d74-36c3-4f93-9d6a-aa98eb663153.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:12:55',NULL,'2023-08-30 19:13:08',NULL,2195620,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('8c87b5ee-3764-433b-8661-0d20bf704264','local','8c87b5ee-3764-433b-8661-0d20bf704264.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:32:15',NULL,'2023-08-30 19:32:36',NULL,2107259,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('9e0659b8-0285-4789-a52b-58931448fa89','local','9e0659b8-0285-4789-a52b-58931448fa89.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:45:27',NULL,'2023-08-30 19:45:39',NULL,2376936,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('cb2b7af7-692c-43d6-a42a-bf67b04cdaf1','local','cb2b7af7-692c-43d6-a42a-bf67b04cdaf1.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:23:54',NULL,'2023-08-30 19:24:04',NULL,2295213,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('d943cdde-184b-47f5-8e1e-efa84940b17f','local','d943cdde-184b-47f5-8e1e-efa84940b17f.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:44:20',NULL,'2023-08-30 19:44:29',NULL,2162985,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('dfe0ab3f-602f-46ba-807e-041ab5dc7fb8','local','dfe0ab3f-602f-46ba-807e-041ab5dc7fb8.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:14:15',NULL,'2023-08-30 19:14:24',NULL,2732666,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}'),
	('fa92239e-4c5d-4aba-a732-57bf4a68acbc','local','fa92239e-4c5d-4aba-a732-57bf4a68acbc.png','image.png','Image','image/jpeg',NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:30:11',NULL,'2023-08-30 19:30:26',NULL,3648564,3024,4032,NULL,NULL,NULL,NULL,NULL,'{}');

/*!40000 ALTER TABLE `directus_files` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_flows
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_flows`;

CREATE TABLE `directus_flows` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `trigger` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountability` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `options` json DEFAULT NULL,
  `operation` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_flows_operation_unique` (`operation`),
  KEY `directus_flows_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_flows_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_folders`;

CREATE TABLE `directus_folders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_folders_parent_foreign` (`parent`),
  CONSTRAINT `directus_folders_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_folders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_migrations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_migrations`;

CREATE TABLE `directus_migrations` (
  `version` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_migrations` WRITE;
/*!40000 ALTER TABLE `directus_migrations` DISABLE KEYS */;

INSERT INTO `directus_migrations` (`version`, `name`, `timestamp`)
VALUES
	('20201028A','Remove Collection Foreign Keys','2023-03-30 23:18:29'),
	('20201029A','Remove System Relations','2023-03-30 23:18:29'),
	('20201029B','Remove System Collections','2023-03-30 23:18:29'),
	('20201029C','Remove System Fields','2023-03-30 23:18:29'),
	('20201105A','Add Cascade System Relations','2023-03-30 23:18:30'),
	('20201105B','Change Webhook URL Type','2023-03-30 23:18:30'),
	('20210225A','Add Relations Sort Field','2023-03-30 23:18:30'),
	('20210304A','Remove Locked Fields','2023-03-30 23:18:30'),
	('20210312A','Webhooks Collections Text','2023-03-30 23:18:30'),
	('20210331A','Add Refresh Interval','2023-03-30 23:18:30'),
	('20210415A','Make Filesize Nullable','2023-03-30 23:18:30'),
	('20210416A','Add Collections Accountability','2023-03-30 23:18:30'),
	('20210422A','Remove Files Interface','2023-03-30 23:18:30'),
	('20210506A','Rename Interfaces','2023-03-30 23:18:30'),
	('20210510A','Restructure Relations','2023-03-30 23:18:30'),
	('20210518A','Add Foreign Key Constraints','2023-03-30 23:18:30'),
	('20210519A','Add System Fk Triggers','2023-03-30 23:18:31'),
	('20210521A','Add Collections Icon Color','2023-03-30 23:18:31'),
	('20210525A','Add Insights','2023-03-30 23:18:31'),
	('20210608A','Add Deep Clone Config','2023-03-30 23:18:31'),
	('20210626A','Change Filesize Bigint','2023-03-30 23:18:31'),
	('20210716A','Add Conditions to Fields','2023-03-30 23:18:31'),
	('20210721A','Add Default Folder','2023-03-30 23:18:31'),
	('20210802A','Replace Groups','2023-03-30 23:18:31'),
	('20210803A','Add Required to Fields','2023-03-30 23:18:31'),
	('20210805A','Update Groups','2023-03-30 23:18:31'),
	('20210805B','Change Image Metadata Structure','2023-03-30 23:18:31'),
	('20210811A','Add Geometry Config','2023-03-30 23:18:31'),
	('20210831A','Remove Limit Column','2023-03-30 23:18:31'),
	('20210903A','Add Auth Provider','2023-03-30 23:18:32'),
	('20210907A','Webhooks Collections Not Null','2023-03-30 23:18:32'),
	('20210910A','Move Module Setup','2023-03-30 23:18:32'),
	('20210920A','Webhooks URL Not Null','2023-03-30 23:18:32'),
	('20210924A','Add Collection Organization','2023-03-30 23:18:32'),
	('20210927A','Replace Fields Group','2023-03-30 23:18:32'),
	('20210927B','Replace M2M Interface','2023-03-30 23:18:32'),
	('20210929A','Rename Login Action','2023-03-30 23:18:32'),
	('20211007A','Update Presets','2023-03-30 23:18:32'),
	('20211009A','Add Auth Data','2023-03-30 23:18:32'),
	('20211016A','Add Webhook Headers','2023-03-30 23:18:32'),
	('20211103A','Set Unique to User Token','2023-03-30 23:18:32'),
	('20211103B','Update Special Geometry','2023-03-30 23:18:32'),
	('20211104A','Remove Collections Listing','2023-03-30 23:18:32'),
	('20211118A','Add Notifications','2023-03-30 23:18:32'),
	('20211211A','Add Shares','2023-03-30 23:18:33'),
	('20211230A','Add Project Descriptor','2023-03-30 23:18:33'),
	('20220303A','Remove Default Project Color','2023-03-30 23:18:33'),
	('20220308A','Add Bookmark Icon and Color','2023-03-30 23:18:33'),
	('20220314A','Add Translation Strings','2023-03-30 23:18:33'),
	('20220322A','Rename Field Typecast Flags','2023-03-30 23:18:33'),
	('20220323A','Add Field Validation','2023-03-30 23:18:33'),
	('20220325A','Fix Typecast Flags','2023-03-30 23:18:33'),
	('20220325B','Add Default Language','2023-03-30 23:18:33'),
	('20220402A','Remove Default Value Panel Icon','2023-03-30 23:18:33'),
	('20220429A','Add Flows','2023-03-30 23:18:33'),
	('20220429B','Add Color to Insights Icon','2023-03-30 23:18:33'),
	('20220429C','Drop Non Null From IP of Activity','2023-03-30 23:18:33'),
	('20220429D','Drop Non Null From Sender of Notifications','2023-03-30 23:18:33'),
	('20220614A','Rename Hook Trigger to Event','2023-03-30 23:18:33'),
	('20220801A','Update Notifications Timestamp Column','2023-03-30 23:18:33'),
	('20220802A','Add Custom Aspect Ratios','2023-03-30 23:18:33'),
	('20220826A','Add Origin to Accountability','2023-03-30 23:18:33'),
	('20230401A','Update Material Icons','2023-05-23 21:32:21'),
	('20230525A','Add Preview Settings','2024-03-20 17:56:15'),
	('20230526A','Migrate Translation Strings','2024-03-20 17:56:16'),
	('20230721A','Require Shares Fields','2024-03-20 17:56:16'),
	('20230823A','Add Content Versioning','2024-03-20 17:56:17'),
	('20230927A','Themes','2024-03-20 17:56:18'),
	('20231009A','Update CSV Fields to Text','2024-03-20 17:56:18'),
	('20231009B','Update Panel Options','2024-03-20 17:56:18'),
	('20231010A','Add Extensions','2024-03-20 17:56:18');

/*!40000 ALTER TABLE `directus_migrations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_notifications
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_notifications`;

CREATE TABLE `directus_notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'inbox',
  `recipient` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_notifications_recipient_foreign` (`recipient`),
  KEY `directus_notifications_sender_foreign` (`sender`),
  CONSTRAINT `directus_notifications_recipient_foreign` FOREIGN KEY (`recipient`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_notifications_sender_foreign` FOREIGN KEY (`sender`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_operations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_operations`;

CREATE TABLE `directus_operations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_x` int NOT NULL,
  `position_y` int NOT NULL,
  `options` json DEFAULT NULL,
  `resolve` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reject` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `flow` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_operations_resolve_unique` (`resolve`),
  UNIQUE KEY `directus_operations_reject_unique` (`reject`),
  KEY `directus_operations_flow_foreign` (`flow`),
  KEY `directus_operations_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_operations_flow_foreign` FOREIGN KEY (`flow`) REFERENCES `directus_flows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_operations_reject_foreign` FOREIGN KEY (`reject`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_resolve_foreign` FOREIGN KEY (`resolve`) REFERENCES `directus_operations` (`id`),
  CONSTRAINT `directus_operations_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_panels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_panels`;

CREATE TABLE `directus_panels` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dashboard` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_header` tinyint(1) NOT NULL DEFAULT '0',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_x` int NOT NULL,
  `position_y` int NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `options` json DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_panels_dashboard_foreign` (`dashboard`),
  KEY `directus_panels_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_panels_dashboard_foreign` FOREIGN KEY (`dashboard`) REFERENCES `directus_dashboards` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_panels_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_permissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_permissions`;

CREATE TABLE `directus_permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissions` json DEFAULT NULL,
  `validation` json DEFAULT NULL,
  `presets` json DEFAULT NULL,
  `fields` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `directus_permissions_collection_foreign` (`collection`),
  KEY `directus_permissions_role_foreign` (`role`),
  CONSTRAINT `directus_permissions_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_permissions` WRITE;
/*!40000 ALTER TABLE `directus_permissions` DISABLE KEYS */;

INSERT INTO `directus_permissions` (`id`, `role`, `collection`, `action`, `permissions`, `validation`, `presets`, `fields`)
VALUES
	(1,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_files','create','{}',NULL,NULL,'*'),
	(2,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_files','read','{}',NULL,NULL,'*'),
	(3,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_files','update','{}',NULL,NULL,'*'),
	(4,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_files','delete','{}',NULL,NULL,'*'),
	(5,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_dashboards','create','{}',NULL,NULL,'*'),
	(6,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_dashboards','read','{}',NULL,NULL,'*'),
	(7,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_dashboards','update','{}',NULL,NULL,'*'),
	(8,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_dashboards','delete','{}',NULL,NULL,'*'),
	(9,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_panels','create','{}',NULL,NULL,'*'),
	(10,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_panels','read','{}',NULL,NULL,'*'),
	(11,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_panels','update','{}',NULL,NULL,'*'),
	(12,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_panels','delete','{}',NULL,NULL,'*'),
	(13,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_folders','create','{}',NULL,NULL,'*'),
	(14,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_folders','read','{}',NULL,NULL,'*'),
	(15,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_folders','update','{}',NULL,NULL,'*'),
	(16,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_folders','delete','{}',NULL,NULL,NULL),
	(17,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_users','read','{}',NULL,NULL,'*'),
	(18,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_users','update','{\"id\": {\"_eq\": \"$CURRENT_USER\"}}',NULL,NULL,'first_name,last_name,email,password,location,title,description,avatar,language,theme,tfa_secret'),
	(19,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_roles','read','{}',NULL,NULL,'*'),
	(20,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_shares','read','{\"_or\": [{\"role\": {\"_eq\": \"$CURRENT_ROLE\"}}, {\"role\": {\"_null\": true}}]}',NULL,NULL,'*'),
	(21,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_shares','create','{}',NULL,NULL,'*'),
	(22,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_shares','update','{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',NULL,NULL,'*'),
	(23,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_shares','delete','{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',NULL,NULL,'*'),
	(24,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','directus_flows','read','{\"trigger\": {\"_eq\": \"manual\"}}',NULL,NULL,'id,name,icon,color,options,trigger'),
	(26,'be352142-bff4-460b-8ef8-5de94986ba55','directus_files','create','{}',NULL,NULL,'*'),
	(27,'be352142-bff4-460b-8ef8-5de94986ba55','directus_files','read','{}',NULL,NULL,'*'),
	(28,'be352142-bff4-460b-8ef8-5de94986ba55','directus_files','update','{}',NULL,NULL,'*'),
	(29,'be352142-bff4-460b-8ef8-5de94986ba55','directus_files','delete','{}',NULL,NULL,'*'),
	(30,'be352142-bff4-460b-8ef8-5de94986ba55','directus_dashboards','create','{}',NULL,NULL,'*'),
	(31,'be352142-bff4-460b-8ef8-5de94986ba55','directus_dashboards','read','{}',NULL,NULL,'*'),
	(32,'be352142-bff4-460b-8ef8-5de94986ba55','directus_dashboards','update','{}',NULL,NULL,'*'),
	(33,'be352142-bff4-460b-8ef8-5de94986ba55','directus_dashboards','delete','{}',NULL,NULL,'*'),
	(34,'be352142-bff4-460b-8ef8-5de94986ba55','directus_panels','create','{}',NULL,NULL,'*'),
	(35,'be352142-bff4-460b-8ef8-5de94986ba55','directus_panels','read','{}',NULL,NULL,'*'),
	(36,'be352142-bff4-460b-8ef8-5de94986ba55','directus_panels','update','{}',NULL,NULL,'*'),
	(37,'be352142-bff4-460b-8ef8-5de94986ba55','directus_panels','delete','{}',NULL,NULL,'*'),
	(38,'be352142-bff4-460b-8ef8-5de94986ba55','directus_folders','create','{}',NULL,NULL,'*'),
	(39,'be352142-bff4-460b-8ef8-5de94986ba55','directus_folders','read','{}',NULL,NULL,'*'),
	(40,'be352142-bff4-460b-8ef8-5de94986ba55','directus_folders','update','{}',NULL,NULL,'*'),
	(41,'be352142-bff4-460b-8ef8-5de94986ba55','directus_folders','delete','{}',NULL,NULL,NULL),
	(42,'be352142-bff4-460b-8ef8-5de94986ba55','directus_users','read','{\"_and\": [{\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}]}',NULL,NULL,'first_name,last_name,email,password,institution,role'),
	(43,'be352142-bff4-460b-8ef8-5de94986ba55','directus_users','update','{\"_and\": [{\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{\"_and\": [{\"_or\": [{\"role\": {\"_eq\": \"b37ac1ce-ad79-46cc-bbdb-f715f3d64d24\"}}, {\"role\": {\"_eq\": \"be352142-bff4-460b-8ef8-5de94986ba55\"}}]}]}',NULL,'first_name,last_name,email,password,institution,role'),
	(44,'be352142-bff4-460b-8ef8-5de94986ba55','directus_roles','read','{}',NULL,NULL,'*'),
	(45,'be352142-bff4-460b-8ef8-5de94986ba55','directus_shares','read','{\"_or\": [{\"role\": {\"_eq\": \"$CURRENT_ROLE\"}}, {\"role\": {\"_null\": true}}]}',NULL,NULL,'*'),
	(46,'be352142-bff4-460b-8ef8-5de94986ba55','directus_shares','create','{}',NULL,NULL,'*'),
	(47,'be352142-bff4-460b-8ef8-5de94986ba55','directus_shares','update','{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',NULL,NULL,'*'),
	(48,'be352142-bff4-460b-8ef8-5de94986ba55','directus_shares','delete','{\"user_created\": {\"_eq\": \"$CURRENT_USER\"}}',NULL,NULL,'*'),
	(49,'be352142-bff4-460b-8ef8-5de94986ba55','directus_flows','read','{\"trigger\": {\"_eq\": \"manual\"}}',NULL,NULL,'id,name,icon,color,options,trigger'),
	(50,'be352142-bff4-460b-8ef8-5de94986ba55','Frameworks','read','{\"_and\": [{\"_or\": [{\"is_public\": {\"_eq\": \"true\"}}, {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}]}]}','{}',NULL,'id,institution,name,is_public,status,Dimensions'),
	(53,NULL,'Frameworks','read','{\"_and\": [{\"is_public\": {\"_eq\": true}}]}',NULL,NULL,'institution,name,id,is_public'),
	(54,'be352142-bff4-460b-8ef8-5de94986ba55','Dimensions','read','{\"_and\": [{\"_or\": [{\"is_public\": {\"_eq\": \"true\"}}, {\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}, {\"status\": {\"_eq\": \"published\"}}]}',NULL,NULL,'id,name,dimension,framework_id,color,status,Framework,Indicators'),
	(55,'be352142-bff4-460b-8ef8-5de94986ba55','Institutions','read','{\"_and\": [{\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{}',NULL,'*'),
	(56,'be352142-bff4-460b-8ef8-5de94986ba55','Locations','read','{\"_and\": [{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}, {\"status\": {\"_eq\": \"published\"}}]}]}',NULL,NULL,'id,name,status,institution_id,is_outreach'),
	(59,'be352142-bff4-460b-8ef8-5de94986ba55','Sessions','read','{\"_and\": [{\"institution_id\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}]}',NULL,NULL,'id,name,location,date,location_id,framework_id,complete,partner_id,institution_id,slider_1,feedback,slider_3,summary,successes,challenges,slider_2,image,status,attendance_count,Observations,user_id,primary_audience'),
	(60,'be352142-bff4-460b-8ef8-5de94986ba55','Sessions','create',NULL,'{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,'name,user_id,location_id,framework_id,date,institution_id,partner_id,complete,slider_1,slider_2,slider_3,feedback,challenges,successes,summary,attendance_count,primary_audience'),
	(62,'be352142-bff4-460b-8ef8-5de94986ba55','Sessions','update',NULL,NULL,NULL,'name,location_id,date,user_id,partner_id,framework_id,complete,institution_id,slider_2,slider_3,slider_1,feedback,challenges,successes,summary,image,attendance_count,primary_audience'),
	(65,'be352142-bff4-460b-8ef8-5de94986ba55','Partners','read','{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,NULL,'nane,id,name,status,institution_id'),
	(67,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Frameworks','read','{\"_and\": [{\"_or\": [{\"is_public\": {\"_eq\": true}}, {\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}]}',NULL,NULL,'id,name,is_public,status,institution,Dimensions'),
	(68,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Institutions','read','{\"_and\": [{\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{}',NULL,'*'),
	(69,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Dimensions','read','{\"_and\": [{\"_or\": [{\"is_public\": {\"_eq\": true}}, {\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}, {\"status\": {\"_eq\": \"published\"}}]}',NULL,NULL,'id,name,framework_id,color,Indicators,Framework,status'),
	(71,'be352142-bff4-460b-8ef8-5de94986ba55','Indicators','read','{\"_and\": [{\"_and\": [{\"dimension_id\": {\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}}, {\"status\": {\"_eq\": \"published\"}}]}]}',NULL,NULL,'id,Name,status,dimension_id,name,Dimension'),
	(72,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Sessions','read','{\"_and\": [{\"user_id\": {\"_eq\": \"$CURRENT_USER\"}}]}',NULL,NULL,'id,name,location_id,partner_id,date,framework_id,institution_id,slider_1,slider_2,slider_3,successes,challenges,feedback,summary,complete,image,attendance_count,status,Observations,user_id,primary_audience'),
	(75,'be352142-bff4-460b-8ef8-5de94986ba55','Observations','read','{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,NULL,'id,note,image,dimension_id,indicator_id,session_id,user_id,date_updated,date_created,is_starred,attendee_code,Sessions,Session'),
	(76,'be352142-bff4-460b-8ef8-5de94986ba55','Observations','create',NULL,NULL,NULL,'user_id,note,indicator_id,dimension_id,image,institution_id,session_id,attendee_code,is_starred,Sessions,Session'),
	(80,'be352142-bff4-460b-8ef8-5de94986ba55','Observations','update','{\"_and\": [{\"user_id\": {\"_eq\": \"$CURRENT_USER\"}}]}',NULL,NULL,'user_id,note,image,attendee_code,indicator_id,dimension_id,is_starred'),
	(81,'be352142-bff4-460b-8ef8-5de94986ba55','Observations','delete','{\"_and\": [{\"Session\": {\"user_id\": {\"_eq\": \"$CURRENT_USER\"}}}]}',NULL,NULL,NULL),
	(82,'be352142-bff4-460b-8ef8-5de94986ba55','Sessions','delete','{\"_and\": [{\"user_id\": {\"id\": {\"_eq\": \"$CURRENT_USER.id\"}}}]}',NULL,NULL,NULL),
	(83,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Indicators','read','{\"_and\": [{\"_and\": [{\"dimension_id\": {\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}}, {\"status\": {\"_eq\": \"published\"}}]}]}',NULL,NULL,'id,name,dimension_id,status,Dimension'),
	(84,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Locations','read','{\"_and\": [{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}, {\"status\": {\"_eq\": \"published\"}}]}]}',NULL,NULL,'name,id,institution_id,status'),
	(85,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Partners','read','{\"_and\": [{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}, {\"status\": {\"_eq\": \"published\"}}]}]}',NULL,NULL,'id,name,institution_id,status'),
	(86,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Sessions','create',NULL,'{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,'name,location_id,partner_id,summary,complete,feedback,challenges,successes,slider_3,slider_2,slider_1,date,framework_id,institution_id,user_id'),
	(87,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Sessions','update',NULL,NULL,NULL,'name,image,location_id,partner_id,user_id,institution_id,framework_id,date,slider_1,slider_2,slider_3,successes,challenges,feedback,summary,complete,attendance_count,primary_audience'),
	(88,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Sessions','delete','{\"_and\": [{\"user_id\": {\"_contains\": \"$CURRENT_USER\"}}]}',NULL,NULL,NULL),
	(89,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Observations','read','{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,NULL,'session_id,user_id,attendee_code,image,note,dimension_id,indicator_id,is_starred,date_updated,date_created,id,Session'),
	(90,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Observations','create',NULL,NULL,NULL,'session_id,image,indicator_id,is_starred,attendee_code,user_id,note,dimension_id,institution_id,Session'),
	(91,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Observations','update','{\"_and\": [{\"user_id\": {\"_eq\": \"$CURRENT_USER\"}}]}',NULL,NULL,'note,image,user_id,attendee_code,is_starred,indicator_id,dimension_id'),
	(92,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Observations','delete','{\"_and\": [{\"user_id\": {\"_eq\": \"$CURRENT_USER\"}}]}',NULL,NULL,NULL),
	(93,'be352142-bff4-460b-8ef8-5de94986ba55','Partners','create',NULL,'{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{\"institution_id\": \"$CURRENT_USER.institution\"}','name,id,status'),
	(97,'be352142-bff4-460b-8ef8-5de94986ba55','Partners','update','{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,NULL,'id,name,status'),
	(98,'be352142-bff4-460b-8ef8-5de94986ba55','Locations','create',NULL,'{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{\"institution_id\": \"$CURRENT_USER.institution\"}','id,name,institution_id,status'),
	(99,'be352142-bff4-460b-8ef8-5de94986ba55','Locations','update','{\"_and\": [{\"institution_id\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,NULL,'id,name,institution_id,status'),
	(100,'be352142-bff4-460b-8ef8-5de94986ba55','Frameworks','create',NULL,'{\"_and\": [{\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{\"institution\": \"$CURRENT_USER.institution\"}','id,institution,name,description,is_public,status'),
	(101,'be352142-bff4-460b-8ef8-5de94986ba55','Frameworks','update','{\"_and\": [{\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}','{\"_and\": [{\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}]}',NULL,'institution,name,id,description,is_public,status,Dimensions'),
	(103,'be352142-bff4-460b-8ef8-5de94986ba55','directus_users','create',NULL,'{\"_and\": [{\"_or\": [{\"role\": {\"_eq\": \"b37ac1ce-ad79-46cc-bbdb-f715f3d64d24\"}}, {\"role\": {\"_eq\": \"be352142-bff4-460b-8ef8-5de94986ba55\"}}]}]}','{\"role\": \"b37ac1ce-ad79-46cc-bbdb-f715f3d64d24\", \"institution\": \"$CURRENT_USER.institution\"}','first_name,last_name,email,password,institution,role'),
	(104,'be352142-bff4-460b-8ef8-5de94986ba55','directus_users','delete','{\"_and\": [{\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}, {\"id\": {\"_neq\": \"$CURRENT_USER.id\"}}]}',NULL,NULL,NULL),
	(105,'be352142-bff4-460b-8ef8-5de94986ba55','Dimensions','create',NULL,NULL,NULL,'id,status,framework_id,name,color,is_public,sort'),
	(107,'be352142-bff4-460b-8ef8-5de94986ba55','Dimensions','update','{\"_and\": [{\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}',NULL,NULL,'id,name,framework_id,status,color,is_public,sort,Framework,Indicators'),
	(109,'be352142-bff4-460b-8ef8-5de94986ba55','Indicators','create',NULL,NULL,NULL,'id,is_public,name,status,dimension_id,Dimension'),
	(110,'be352142-bff4-460b-8ef8-5de94986ba55','Dimensions','delete','{\"_and\": [{\"framework_id\": {\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}',NULL,NULL,NULL),
	(111,'be352142-bff4-460b-8ef8-5de94986ba55','Frameworks','delete','{\"_and\": [{\"institution\": {\"id\": {\"_eq\": \"$CURRENT_USER.institution\"}}}]}',NULL,NULL,NULL),
	(112,'be352142-bff4-460b-8ef8-5de94986ba55','Indicators','delete','{\"_and\": [{\"dimension_id\": {\"framework_id\": {\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}',NULL,NULL,NULL),
	(113,'be352142-bff4-460b-8ef8-5de94986ba55','Indicators','update','{\"_and\": [{\"Dimension\": {\"framework_id\": {\"institution\": {\"_eq\": \"$CURRENT_USER.institution\"}}}}]}',NULL,NULL,'name,dimension_id,Dimension,is_public,status'),
	(114,'b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Locations','create',NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `directus_permissions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_presets
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_presets`;

CREATE TABLE `directus_presets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `bookmark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `search` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `layout` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'tabular',
  `layout_query` json DEFAULT NULL,
  `layout_options` json DEFAULT NULL,
  `refresh_interval` int DEFAULT NULL,
  `filter` json DEFAULT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'bookmark',
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_presets_collection_foreign` (`collection`),
  KEY `directus_presets_user_foreign` (`user`),
  KEY `directus_presets_role_foreign` (`role`),
  CONSTRAINT `directus_presets_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_presets_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_presets` WRITE;
/*!40000 ALTER TABLE `directus_presets` DISABLE KEYS */;

INSERT INTO `directus_presets` (`id`, `bookmark`, `user`, `role`, `collection`, `search`, `layout`, `layout_query`, `layout_options`, `refresh_interval`, `filter`, `icon`, `color`)
VALUES
	(1,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Frameworks',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"is_public\", \"name\", \"status\", \"institution\"]}}','{\"tabular\": {\"widths\": {\"name\": 254.4765625, \"status\": 118.9140625, \"is_public\": 116.1640625}}}',NULL,NULL,'bookmark_border',NULL),
	(2,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Frameworks',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"is_public\", \"name\", \"status\", \"institution\"]}}','{\"tabular\": {\"widths\": {\"name\": 254.4765625, \"status\": 118.9140625, \"is_public\": 116.1640625}}}',NULL,NULL,'bookmark_border',NULL),
	(3,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Institutions',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"Name\", \"session_slider_1_question\", \"session_slider_2_question\", \"session_slider_3_question\"]}}','{\"tabular\": {\"widths\": {\"Name\": 107.1259765625, \"session_slider_1_question\": 217.67266845703125, \"session_slider_2_question\": 221.34454345703125, \"session_slider_3_question\": 312.15478515625}}}',NULL,NULL,'bookmark_border',NULL),
	(4,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Institutions',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"Name\", \"session_slider_1_question\", \"session_slider_2_question\", \"session_slider_3_question\"]}}','{\"tabular\": {\"widths\": {\"Name\": 107.1259765625, \"session_slider_1_question\": 217.67266845703125, \"session_slider_2_question\": 221.34454345703125, \"session_slider_3_question\": 312.15478515625}}}',NULL,NULL,'bookmark_border',NULL),
	(5,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'directus_users',NULL,'tabular','{\"cards\": {\"page\": 1, \"sort\": [\"email\"]}, \"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"first_name\", \"last_name\", \"role\", \"institution\"]}}','{\"cards\": {\"icon\": \"account_circle\", \"size\": 5, \"title\": \"{{ first_name }} {{ last_name }}\", \"subtitle\": \"{{ email }}\"}, \"tabular\": {\"widths\": {\"role\": 218.259765625, \"institution\": 200.5718994140625}}}',NULL,NULL,'bookmark_border',NULL),
	(6,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'directus_files',NULL,'cards','{\"cards\": {\"page\": 1, \"sort\": [\"-uploaded_on\"], \"limit\": 25}}','{\"cards\": {\"icon\": \"insert_drive_file\", \"size\": 4, \"title\": \"{{ title }}\", \"imageFit\": \"crop\", \"subtitle\": \"{{ type }} • {{ filesize }}\"}}',NULL,NULL,'bookmark',NULL),
	(7,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Sessions','','tabular','{\"cards\": {\"page\": 1, \"limit\": 100}, \"tabular\": {\"page\": 1, \"sort\": [\"-date\"], \"limit\": 25, \"fields\": [\"id\", \"name\", \"date\", \"framework_id\", \"user_id.first_name\", \"user_id.last_name\", \"location_id.name\", \"partner_id.name\", \"institution_id\", \"complete\", \"image\", \"attendance_count\"]}}','{\"tabular\": {\"widths\": {\"id\": 113.10055541992188, \"name\": 268.23126220703125, \"complete\": 133.6180419921875, \"institution_id\": 124.3143310546875, \"partner_id.name\": 124.1640625, \"location_id.name\": 104.4383544921875, \"user_id.last_name\": 96.740478515625, \"user_id.first_name\": 135.828125}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(8,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'directus_webhooks',NULL,'tabular','{\"tabular\": {\"limit\": 25, \"fields\": [\"status\", \"method\", \"name\", \"collections\", \"actions\"]}}','{\"tabular\": {\"widths\": {\"name\": 210, \"method\": 100, \"status\": 32, \"actions\": 210, \"collections\": 240}}}',NULL,NULL,'bookmark',NULL),
	(9,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'directus_presets',NULL,NULL,'{\"tabular\": {\"limit\": 25}}',NULL,NULL,NULL,'bookmark',NULL),
	(10,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Partners',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25}}','{\"tabular\": {\"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(11,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Partners',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25}}','{\"tabular\": {\"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(13,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Locations',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"institution_id\", \"is_outreach\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"id\": 66.9610595703125}}}',NULL,NULL,'bookmark',NULL),
	(14,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Locations',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"institution_id\", \"is_outreach\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"id\": 66.9610595703125}}}',NULL,NULL,'bookmark',NULL),
	(15,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Dimensions',NULL,'tabular','{\"cards\": {\"limit\": 25}, \"tabular\": {\"page\": 1, \"sort\": [\"framework_id\"], \"limit\": 25, \"fields\": [\"framework_id\", \"color\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"name\": 231, \"color\": 115}}}',NULL,NULL,'bookmark',NULL),
	(16,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Institutions',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25}}',NULL,NULL,NULL,'bookmark',NULL),
	(17,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Locations',NULL,'tabular','{\"cards\": {\"limit\": 25}, \"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"institution_id\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"id\": 45, \"name\": 237, \"status\": 93, \"institution_id\": 206}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(18,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Locations',NULL,'tabular','{\"cards\": {\"limit\": 25}, \"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"institution_id\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"id\": 45, \"name\": 237, \"status\": 93, \"institution_id\": 206}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(19,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Partners',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"id\": 32, \"name\": 259}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(20,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Sessions',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"id\", \"name\", \"image\", \"location_id.name\", \"partner_id.name\"]}}','{\"tabular\": {\"widths\": {\"id\": 42}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(21,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Indicators',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"dimension_id.framework_id.name\", \"dimension_id\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"name\": 212, \"dimension_id\": 239, \"dimension_id.framework_id.name\": 139}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(22,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Frameworks',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25, \"fields\": [\"institution\", \"is_public\", \"name\", \"status\"]}}','{\"tabular\": {\"widths\": {\"status\": 105, \"is_public\": 99, \"institution\": 202}, \"spacing\": \"compact\"}}',NULL,NULL,'bookmark',NULL),
	(23,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'directus_users',NULL,'cards','{\"cards\": {\"page\": 1, \"sort\": [\"email\"], \"limit\": 25}}','{\"cards\": {\"icon\": \"account_circle\", \"size\": 4, \"title\": \"{{ first_name }} {{ last_name }}\", \"subtitle\": \"{{ email }}\"}}',NULL,NULL,'bookmark',NULL),
	(24,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'directus_files',NULL,'cards','{\"cards\": {\"sort\": [\"-uploaded_on\"], \"limit\": 25}}','{\"cards\": {\"icon\": \"insert_drive_file\", \"size\": 4, \"title\": \"{{ title }}\", \"imageFit\": \"crop\", \"subtitle\": \"{{ type }} • {{ filesize }}\"}}',NULL,NULL,'bookmark',NULL),
	(25,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,'Observations',NULL,NULL,'{\"tabular\": {\"page\": 1, \"limit\": 25}}',NULL,NULL,NULL,'bookmark',NULL),
	(38,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Indicators',NULL,NULL,'{\"tabular\": {\"page\": 1}}',NULL,NULL,NULL,'bookmark',NULL),
	(39,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Dimensions',NULL,NULL,'{\"tabular\": {\"page\": 1}}',NULL,NULL,NULL,'bookmark',NULL),
	(43,NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50',NULL,'Observations',NULL,NULL,'{\"tabular\": {\"page\": 1}}',NULL,NULL,NULL,'bookmark',NULL);

/*!40000 ALTER TABLE `directus_presets` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_relations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_relations`;

CREATE TABLE `directus_relations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `many_collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `many_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `one_collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_collection_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_allowed_collections` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `junction_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_field` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `one_deselect_action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nullify',
  PRIMARY KEY (`id`),
  KEY `directus_relations_many_collection_foreign` (`many_collection`),
  KEY `directus_relations_one_collection_foreign` (`one_collection`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_relations` WRITE;
/*!40000 ALTER TABLE `directus_relations` DISABLE KEYS */;

INSERT INTO `directus_relations` (`id`, `many_collection`, `many_field`, `one_collection`, `one_field`, `one_collection_field`, `one_allowed_collections`, `junction_field`, `sort_field`, `one_deselect_action`)
VALUES
	(1,'Frameworks','user_created','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(2,'Dimensions','user_created','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(4,'Indicators','user_created','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(7,'Frameworks','institution','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(8,'directus_users','institution','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(10,'Sessions','user_created','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(11,'Locations','user_created','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(12,'Locations','institution_id','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(14,'Sessions','framework_id','Frameworks',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(15,'Sessions','institution_id','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(16,'Sessions','location_id','Locations',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(17,'Sessions','user_id','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(18,'Locations','user_id','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(19,'Partners','institution_id','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(20,'Sessions','partner_id','Partners',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(21,'Dimensions','framework_id','Frameworks',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(22,'Indicators','dimension_id','Dimensions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(30,'Observations','user_id','directus_users',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(31,'Observations','image','directus_files',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(32,'Observations','dimension_id','Dimensions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(33,'Observations','indicator_id','Indicators',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(34,'Observations','institution_id','Institutions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(35,'Observations','session_id','Sessions',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(36,'Sessions','image','directus_files',NULL,NULL,NULL,NULL,NULL,'nullify'),
	(40,'Observations','Session','Sessions','Observations',NULL,NULL,NULL,NULL,'nullify'),
	(41,'Indicators','Dimension','Dimensions','Indicators',NULL,NULL,NULL,NULL,'nullify'),
	(42,'Dimensions','Framework','Frameworks','Dimensions',NULL,NULL,NULL,NULL,'nullify');

/*!40000 ALTER TABLE `directus_relations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_revisions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_revisions`;

CREATE TABLE `directus_revisions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `activity` int unsigned NOT NULL,
  `collection` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `delta` json DEFAULT NULL,
  `parent` int unsigned DEFAULT NULL,
  `version` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_revisions_collection_foreign` (`collection`),
  KEY `directus_revisions_parent_foreign` (`parent`),
  KEY `directus_revisions_activity_foreign` (`activity`),
  KEY `directus_revisions_version_foreign` (`version`),
  CONSTRAINT `directus_revisions_activity_foreign` FOREIGN KEY (`activity`) REFERENCES `directus_activity` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_revisions_parent_foreign` FOREIGN KEY (`parent`) REFERENCES `directus_revisions` (`id`),
  CONSTRAINT `directus_revisions_version_foreign` FOREIGN KEY (`version`) REFERENCES `directus_versions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_roles`;

CREATE TABLE `directus_roles` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'supervised_user_circle',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `ip_access` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `enforce_tfa` tinyint(1) NOT NULL DEFAULT '0',
  `admin_access` tinyint(1) NOT NULL DEFAULT '0',
  `app_access` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_roles` WRITE;
/*!40000 ALTER TABLE `directus_roles` DISABLE KEYS */;

INSERT INTO `directus_roles` (`id`, `name`, `icon`, `description`, `ip_access`, `enforce_tfa`, `admin_access`, `app_access`)
VALUES
	('b37ac1ce-ad79-46cc-bbdb-f715f3d64d24','Observer','local_see',NULL,NULL,0,0,1),
	('be352142-bff4-460b-8ef8-5de94986ba55','Institutional Manager','supervised_user_circle',NULL,NULL,0,0,1),
	('fb78712d-b924-4a77-9ad6-707b3f3b8505','Administrator','verified','$t:admin_description',NULL,0,1,1);

/*!40000 ALTER TABLE `directus_roles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_sessions`;

CREATE TABLE `directus_sessions` (
  `token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires` timestamp NOT NULL,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `share` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `origin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`token`),
  KEY `directus_sessions_user_foreign` (`user`),
  KEY `directus_sessions_share_foreign` (`share`),
  CONSTRAINT `directus_sessions_share_foreign` FOREIGN KEY (`share`) REFERENCES `directus_shares` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_sessions_user_foreign` FOREIGN KEY (`user`) REFERENCES `directus_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_sessions` WRITE;
/*!40000 ALTER TABLE `directus_sessions` DISABLE KEYS */;

INSERT INTO `directus_sessions` (`token`, `user`, `expires`, `ip`, `user_agent`, `share`, `origin`)
VALUES
	('J4ZGqiLZb5deEnFLIZ_eE5YN7muZwbHD5VTkndUaFkJG2qm26yVm6Rdi1HTpAlh_','fc559882-2ab5-48cf-b075-dbca750a5f50','2026-01-22 19:20:39','127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',NULL,'https://madpl.bytestudios.com');

/*!40000 ALTER TABLE `directus_sessions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_settings
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_settings`;

CREATE TABLE `directus_settings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `project_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Directus',
  `project_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#6644FF',
  `project_logo` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `public_foreground` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `public_background` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `public_note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `auth_login_attempts` int unsigned DEFAULT '25',
  `auth_password_policy` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `storage_asset_transform` varchar(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'all',
  `storage_asset_presets` json DEFAULT NULL,
  `custom_css` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `storage_default_folder` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `basemaps` json DEFAULT NULL,
  `mapbox_key` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `module_bar` json DEFAULT NULL,
  `project_descriptor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en-US',
  `custom_aspect_ratios` json DEFAULT NULL,
  `public_favicon` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_appearance` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'auto',
  `default_theme_light` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_light_overrides` json DEFAULT NULL,
  `default_theme_dark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_dark_overrides` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_settings_project_logo_foreign` (`project_logo`),
  KEY `directus_settings_public_foreground_foreign` (`public_foreground`),
  KEY `directus_settings_public_background_foreign` (`public_background`),
  KEY `directus_settings_storage_default_folder_foreign` (`storage_default_folder`),
  KEY `directus_settings_public_favicon_foreign` (`public_favicon`),
  CONSTRAINT `directus_settings_project_logo_foreign` FOREIGN KEY (`project_logo`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_background_foreign` FOREIGN KEY (`public_background`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_favicon_foreign` FOREIGN KEY (`public_favicon`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_public_foreground_foreign` FOREIGN KEY (`public_foreground`) REFERENCES `directus_files` (`id`),
  CONSTRAINT `directus_settings_storage_default_folder_foreign` FOREIGN KEY (`storage_default_folder`) REFERENCES `directus_folders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_shares
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_shares`;

CREATE TABLE `directus_shares` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_start` timestamp NULL DEFAULT NULL,
  `date_end` timestamp NULL DEFAULT NULL,
  `times_used` int DEFAULT '0',
  `max_uses` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_shares_collection_foreign` (`collection`),
  KEY `directus_shares_role_foreign` (`role`),
  KEY `directus_shares_user_created_foreign` (`user_created`),
  CONSTRAINT `directus_shares_collection_foreign` FOREIGN KEY (`collection`) REFERENCES `directus_collections` (`collection`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `directus_shares_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_translations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_translations`;

CREATE TABLE `directus_translations` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `language` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_users`;

CREATE TABLE `directus_users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tags` json DEFAULT NULL,
  `avatar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tfa_secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `role` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_access` timestamp NULL DEFAULT NULL,
  `last_page` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `external_identifier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auth_data` json DEFAULT NULL,
  `email_notifications` tinyint(1) DEFAULT '1',
  `institution` int unsigned DEFAULT NULL,
  `appearance` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_dark` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_light` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `theme_light_overrides` json DEFAULT NULL,
  `theme_dark_overrides` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `directus_users_external_identifier_unique` (`external_identifier`),
  UNIQUE KEY `directus_users_email_unique` (`email`),
  UNIQUE KEY `directus_users_token_unique` (`token`),
  KEY `directus_users_role_foreign` (`role`),
  KEY `directus_users_institution_foreign` (`institution`),
  CONSTRAINT `directus_users_institution_foreign` FOREIGN KEY (`institution`) REFERENCES `Institutions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_users_role_foreign` FOREIGN KEY (`role`) REFERENCES `directus_roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `directus_users` WRITE;
/*!40000 ALTER TABLE `directus_users` DISABLE KEYS */;

INSERT INTO `directus_users` (`id`, `first_name`, `last_name`, `email`, `password`, `location`, `title`, `description`, `tags`, `avatar`, `language`, `tfa_secret`, `status`, `role`, `token`, `last_access`, `last_page`, `provider`, `external_identifier`, `auth_data`, `email_notifications`, `institution`, `appearance`, `theme_dark`, `theme_light`, `theme_light_overrides`, `theme_dark_overrides`)
VALUES
	('6f013c02-9f5c-4389-b8ef-7cf40d94f606','Institution ','Manager ','manageremail@yourinstitution.org','$argon2id$v=19$m=65536,t=3,p=4$ybPkj6mFoTbMXqYg/Di9ZQ$p9pSPqkdvZnIxtWu7at0dWs1me9mrFBi4ZMGGOc5zdI',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','be352142-bff4-460b-8ef8-5de94986ba55',NULL,'2024-10-16 17:47:04','/content/Sessions','default',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL),
	('f17e0f40-f22b-403e-8cca-0d74fcd02a75','Library ','Observer','observer@yourinstitution.org','$argon2id$v=19$m=65536,t=3,p=4$wuFdMMF3mtSxOuX1osvD5g$RYIVyDcqOJuTsvFrU1HeziMN9G+15ymURUc5UqnBAKo','Madison','Example ',NULL,NULL,NULL,NULL,NULL,'active','b37ac1ce-ad79-46cc-bbdb-f715f3d64d24',NULL,'2024-05-16 17:24:03',NULL,'default',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL),
	('fc559882-2ab5-48cf-b075-dbca750a5f50','Admin','User','admin@yourinstitution.org','$argon2id$v=19$m=65536,t=3,p=4$WeqEHa;BnAykyanxwowqWz7g$8WKJK47LJK05kKLJ1NdlJ/Fj8wEEvnq6tk/FS5aMKPFgxz481DM',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'active','fb78712d-b924-4a77-9ad6-707b3f3b8505',NULL,'2026-01-15 19:20:39','/content/Dimensions','default',NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL);

/*!40000 ALTER TABLE `directus_users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table directus_versions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_versions`;

CREATE TABLE `directus_versions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `collection` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_created` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_updated` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directus_versions_collection_foreign` (`collection`),
  KEY `directus_versions_user_created_foreign` (`user_created`),
  KEY `directus_versions_user_updated_foreign` (`user_updated`),
  CONSTRAINT `directus_versions_collection_foreign` FOREIGN KEY (`collection`) REFERENCES `directus_collections` (`collection`) ON DELETE CASCADE,
  CONSTRAINT `directus_versions_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `directus_versions_user_updated_foreign` FOREIGN KEY (`user_updated`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table directus_webhooks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `directus_webhooks`;

CREATE TABLE `directus_webhooks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'POST',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `data` tinyint(1) NOT NULL DEFAULT '1',
  `actions` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `collections` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table Frameworks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Frameworks`;

CREATE TABLE `Frameworks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `sort` int DEFAULT NULL,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '1',
  `institution` int unsigned DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `frameworks_user_created_foreign` (`user_created`),
  KEY `frameworks_institution_foreign` (`institution`),
  CONSTRAINT `frameworks_institution_foreign` FOREIGN KEY (`institution`) REFERENCES `Institutions` (`id`),
  CONSTRAINT `frameworks_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Frameworks` WRITE;
/*!40000 ALTER TABLE `Frameworks` DISABLE KEYS */;

INSERT INTO `Frameworks` (`id`, `status`, `sort`, `user_created`, `date_created`, `name`, `is_public`, `institution`, `description`)
VALUES
	(1,'published',NULL,'fc559882-2ab5-48cf-b075-dbca750a5f50','2023-03-30 23:38:18','Madison Bubbler',1,1,NULL);

/*!40000 ALTER TABLE `Frameworks` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Indicators
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Indicators`;

CREATE TABLE `Indicators` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '0',
  `dimension_id` int unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Dimension` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `indicators_user_created_foreign` (`user_created`),
  KEY `indicators_dimension_id_foreign` (`dimension_id`),
  KEY `indicators_dimension_foreign` (`Dimension`),
  CONSTRAINT `indicators_dimension_foreign` FOREIGN KEY (`Dimension`) REFERENCES `Dimensions` (`id`),
  CONSTRAINT `indicators_dimension_id_foreign` FOREIGN KEY (`dimension_id`) REFERENCES `Dimensions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `indicators_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Indicators` WRITE;
/*!40000 ALTER TABLE `Indicators` DISABLE KEYS */;

INSERT INTO `Indicators` (`id`, `status`, `user_created`, `date_created`, `is_public`, `dimension_id`, `name`, `Dimension`)
VALUES
	(1,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:24:31',1,1,'Connection to Self Identity',1),
	(2,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:27:34',1,1,'Connection to Social or Group Dynamic',1),
	(3,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:28:17',1,1,'Connection to world or Culture',1),
	(4,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:28:36',1,1,'Connection to staff, artist, or space',1),
	(5,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:28:55',1,2,'Actively participating',2),
	(6,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:29:29',1,2,'Setting own goals',2),
	(7,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:29:44',1,2,'Taking risks',2),
	(8,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:29:56',1,2,'Adjusting goals based on feedback and evidence',2),
	(9,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:30:13',1,3,'Trouble shooting & iterating',3),
	(10,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:30:25',1,3,'Breaking problems into parts',3),
	(11,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:30:44',1,3,'Seeking tools, materials, and ideas to solve s problem',3),
	(12,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:30:59',1,3,'Developing work arounds',3),
	(13,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:31:15',1,4,'Playful exploring',4),
	(14,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:31:38',1,4,'Responding aesthetically to materials and processes',4),
	(15,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:31:53',1,4,'Using materials in novel ways',4),
	(16,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:32:08',1,4,'Focusing on process vs. product',4),
	(17,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:32:22',1,5,'Working together',5),
	(18,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:32:37',1,5,'Observing others',5),
	(19,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:32:51',1,5,'Helping, offering, or accepting help',5),
	(20,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-21 17:33:07',1,5,'Expressing strong emotions related to making, pride, joy, frustration, investment',5),
	(55,'published','6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-10-16 18:43:35',1,5,'Documenting or sharing ideas',5);

/*!40000 ALTER TABLE `Indicators` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Institutions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Institutions`;

CREATE TABLE `Institutions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_slider_1_question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_1_label_low` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_1_label_medium` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_1_label_high` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_2_question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_2_label_low` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_2_label_medium` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_2_label_high` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_3_question` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_3_label_low` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_3_label_medium` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_slider_3_label_high` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Institutions` WRITE;
/*!40000 ALTER TABLE `Institutions` DISABLE KEYS */;

INSERT INTO `Institutions` (`id`, `Name`, `session_slider_1_question`, `session_slider_1_label_low`, `session_slider_1_label_medium`, `session_slider_1_label_high`, `session_slider_2_question`, `session_slider_2_label_low`, `session_slider_2_label_medium`, `session_slider_2_label_high`, `session_slider_3_question`, `session_slider_3_label_low`, `session_slider_3_label_medium`, `session_slider_3_label_high`, `status`)
VALUES
	(1,'MADISON PUBLIC LIBRARY','Session Engagement','Low','Medium','High','Session Vibe / Energy','Chill','Active ','Intense','Session depth / richness of learning experience','Surface','Mid','Deep','published');

/*!40000 ALTER TABLE `Institutions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Locations`;

CREATE TABLE `Locations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institution_id` int unsigned DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `locations_user_created_foreign` (`user_created`),
  KEY `locations_institution_id_foreign` (`institution_id`),
  KEY `locations_user_id_foreign` (`user_id`),
  CONSTRAINT `locations_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `locations_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`),
  CONSTRAINT `locations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Locations` WRITE;
/*!40000 ALTER TABLE `Locations` DISABLE KEYS */;

INSERT INTO `Locations` (`id`, `status`, `user_created`, `date_created`, `name`, `institution_id`, `user_id`)
VALUES
	(2,'published','fc559882-2ab5-48cf-b075-dbca750a5f50','2023-05-30 21:55:20','EXAMPLE LIBRARY',1,NULL),
	(13,'archived','6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-15 16:43:38','Test Archived Location !',1,NULL);

/*!40000 ALTER TABLE `Locations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Observations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Observations`;

CREATE TABLE `Observations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date_created` timestamp NULL DEFAULT NULL,
  `date_updated` timestamp NULL DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dimension_id` int unsigned DEFAULT NULL,
  `indicator_id` int unsigned DEFAULT NULL,
  `institution_id` int unsigned DEFAULT NULL,
  `session_id` int unsigned DEFAULT NULL,
  `is_starred` tinyint(1) DEFAULT NULL,
  `attendee_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Session` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `observations_user_id_foreign` (`user_id`),
  KEY `observations_image_foreign` (`image`),
  KEY `observations_dimension_id_foreign` (`dimension_id`),
  KEY `observations_indicator_id_foreign` (`indicator_id`),
  KEY `observations_institution_id_foreign` (`institution_id`),
  KEY `observations_session_id_foreign` (`session_id`),
  KEY `observations_session_foreign` (`Session`),
  CONSTRAINT `observations_dimension_id_foreign` FOREIGN KEY (`dimension_id`) REFERENCES `Dimensions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_image_foreign` FOREIGN KEY (`image`) REFERENCES `directus_files` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `Indicators` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_session_foreign` FOREIGN KEY (`Session`) REFERENCES `Sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `Sessions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `observations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Observations` WRITE;
/*!40000 ALTER TABLE `Observations` DISABLE KEYS */;

INSERT INTO `Observations` (`id`, `date_created`, `date_updated`, `user_id`, `note`, `image`, `dimension_id`, `indicator_id`, `institution_id`, `session_id`, `is_starred`, `attendee_code`, `Session`)
VALUES
	(80,'2023-08-30 19:13:09','2024-05-02 20:02:54','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Hat fitting - that was really clever. I wouldn’t have thought of putting it together that way',NULL,5,17,1,61,0,NULL,61),
	(82,'2023-08-30 19:16:10','2024-05-02 20:02:01','6f013c02-9f5c-4389-b8ef-7cf40d94f606','A summer hat for summer colors but also for sun protections',NULL,2,6,1,61,0,NULL,61),
	(83,'2023-08-30 19:18:13','2024-05-02 20:02:08','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Designing a large and full body puppet ',NULL,3,9,1,61,0,NULL,61),
	(84,'2023-08-30 19:24:05','2024-05-02 20:02:16','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Using yarn for hair. Responding to eh texture ',NULL,4,14,1,61,0,NULL,61),
	(85,'2023-08-30 19:25:54','2024-05-02 20:02:22','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Spring mechanism to opening back up automatically ',NULL,3,10,1,61,0,NULL,61),
	(86,'2023-08-30 19:30:26','2024-05-02 20:02:29','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Needed to add padding to the drop. Added pipe cleaners to add structure to the bag',NULL,3,11,1,61,0,NULL,61),
	(87,'2023-08-30 19:32:37','2024-05-02 20:02:35','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Continuously improving on a “finished” design',NULL,5,20,1,61,0,NULL,61),
	(88,'2023-08-30 19:36:00','2024-05-02 20:02:41','6f013c02-9f5c-4389-b8ef-7cf40d94f606','Innovative ear wraps to hold her mask on her head',NULL,3,9,1,61,1,NULL,61),
	(90,'2023-08-30 19:45:39','2024-05-02 20:02:49','6f013c02-9f5c-4389-b8ef-7cf40d94f606','“This is the party table”',NULL,1,2,1,61,0,NULL,61);

/*!40000 ALTER TABLE `Observations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Partners
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Partners`;

CREATE TABLE `Partners` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `institution_id` int unsigned DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `partners_institution_id_foreign` (`institution_id`),
  CONSTRAINT `partners_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Partners` WRITE;
/*!40000 ALTER TABLE `Partners` DISABLE KEYS */;

INSERT INTO `Partners` (`id`, `status`, `institution_id`, `name`)
VALUES
	(1,'published',1,'Example Community Engagement Partner '),
	(4,'archived',1,'MPL Archived Partner Test');

/*!40000 ALTER TABLE `Partners` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table Sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Sessions`;

CREATE TABLE `Sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_created` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `framework_id` int unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `institution_id` int unsigned DEFAULT NULL,
  `location_id` int unsigned DEFAULT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `partner_id` int unsigned DEFAULT NULL,
  `complete` tinyint(1) NOT NULL DEFAULT '0',
  `slider_1` int DEFAULT NULL,
  `slider_2` int DEFAULT NULL,
  `slider_3` int DEFAULT NULL,
  `feedback` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `challenges` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `successes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'published',
  `attendance_count` int DEFAULT NULL,
  `primary_audience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_created_foreign` (`user_created`),
  KEY `sessions_framework_id_foreign` (`framework_id`),
  KEY `sessions_institution_id_foreign` (`institution_id`),
  KEY `sessions_location_id_foreign` (`location_id`),
  KEY `sessions_user_id_foreign` (`user_id`),
  KEY `sessions_partner_id_foreign` (`partner_id`),
  KEY `sessions_image_foreign` (`image`),
  CONSTRAINT `sessions_framework_id_foreign` FOREIGN KEY (`framework_id`) REFERENCES `Frameworks` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_image_foreign` FOREIGN KEY (`image`) REFERENCES `directus_files` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_institution_id_foreign` FOREIGN KEY (`institution_id`) REFERENCES `Institutions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `Locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `Partners` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sessions_user_created_foreign` FOREIGN KEY (`user_created`) REFERENCES `directus_users` (`id`),
  CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `directus_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;

INSERT INTO `Sessions` (`id`, `user_created`, `date_created`, `name`, `framework_id`, `date`, `institution_id`, `location_id`, `user_id`, `partner_id`, `complete`, `slider_1`, `slider_2`, `slider_3`, `feedback`, `challenges`, `successes`, `summary`, `image`, `status`, `attendance_count`, `primary_audience`)
VALUES
	(61,'6f013c02-9f5c-4389-b8ef-7cf40d94f606','2023-08-30 19:07:20','Example Maker Session ',1,'2023-08-30 14:07:00',1,NULL,'6f013c02-9f5c-4389-b8ef-7cf40d94f606',NULL,1,79,52,96,'Provide concrete “reflection tools” educators can take home with them',NULL,'There was incredibly high engagement in the session and having so much choice, but everyone had the opportunity to pick some thing that was interesting to them. There was also a lot of innovative use of materials that I had an expected.','MOST out of school time educators explored engineering challenges, but added the component of storytelling to deep in their engagement and participation.','71deaa39-b1bc-488d-b6e7-183775e28be6','published',30,'Adult 19+');

/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
