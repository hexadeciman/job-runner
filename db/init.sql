DROP DATABASE IF EXISTS crawler;
CREATE DATABASE crawler;    

USE crawler;

CREATE TABLE t_search (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `search_query` VARCHAR(500) DEFAULT '',
  `description` varchar(100),
  `included_keywords` varchar(255),
  `excluded_keywords` varchar(255),
  `platform` varchar(50),
  `date_created` timestamp default CURRENT_TIMESTAMP,
  `archived` int(1) not null default 0,
  PRIMARY KEY (id)
);

CREATE TABLE t_match
(
  `id` int(20) NOT NULL auto_increment,
  `timestamp` timestamp default CURRENT_TIMESTAMP,
  `add_id` bigint,
  `date_created` varchar(100),
  `address` varchar(400),
  `coordinates` varchar(100),
  `price` int,
  `photos` longtext,
  `description` longtext,
  `contact` varchar(100),
  `fk_search` int,
  `link` varchar(400),
  PRIMARY KEY (id)
);

ALTER TABLE t_match ADD UNIQUE (`add_id`);

CREATE TABLE t_ping
(
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `fk_search_id` int(20) unique,
  `count` int(20) default 0,	
  `timestamp` timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
