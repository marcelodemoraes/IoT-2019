BEGIN TRANSACTION;

CREATE TABLE DEVICES (
MAC varchar(17) NOT NULL,
RSSI1 INTEGER,
RSSI2 INTEGER,
RSSI3 INTEGER,
DATE TIMESTAMP,
CONSTRAINT PK_DEVICES
	PRIMARY KEY(MAC,DATE)
);

END TRANSACTION;
