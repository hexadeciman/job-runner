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
  `fk_search` int,
  `price` int,
  `coordinates` varchar(100),
  `timestamp` timestamp default CURRENT_TIMESTAMP,
  `link` varchar(400),
  `photos` longtext,
  `description` longtext,
  `contact` varchar(100),
  PRIMARY KEY (id)
);

CREATE TABLE t_ping
(
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `fk_search_id` int(20) unique,
  `count` int(20) default 0,	
  `timestamp` timestamp default CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
