DROP TABLE Branded CASCADE CONSTRAINTS;
DROP TABLE Brand CASCADE CONSTRAINTS;
DROP TABLE AppearsIn CASCADE CONSTRAINTS;
DROP TABLE Clothes CASCADE CONSTRAINTS;
DROP TABLE Clothes_Price CASCADE CONSTRAINTS;
DROP TABLE WorkedOn CASCADE CONSTRAINTS;
DROP TABLE Photographed CASCADE CONSTRAINTS;
DROP TABLE Model CASCADE CONSTRAINTS;
DROP TABLE Photographer CASCADE CONSTRAINTS;
DROP TABLE Author CASCADE CONSTRAINTS;
DROP TABLE Contributor CASCADE CONSTRAINTS;
DROP TABLE Contributor_EmailDetails CASCADE CONSTRAINTS;
DROP TABLE Birthday_Age CASCADE CONSTRAINTS;
DROP TABLE Contains CASCADE CONSTRAINTS;
DROP TABLE Photo CASCADE CONSTRAINTS;
DROP TABLE Photo_FileType CASCADE CONSTRAINTS;
DROP TABLE Article CASCADE CONSTRAINTS;
DROP TABLE Article_PageRange CASCADE CONSTRAINTS;
DROP TABLE Issue CASCADE CONSTRAINTS;
DROP TABLE Magazine CASCADE CONSTRAINTS;
DROP TABLE Publisher CASCADE CONSTRAINTS;
DROP TABLE Publisher_Location CASCADE CONSTRAINTS;
DROP TABLE Wears CASCADE CONSTRAINTS;


-- CREATE TABLES

CREATE TABLE Publisher_Location (
  address  VARCHAR2(30) PRIMARY KEY,
  city     VARCHAR2(20),
  country  CHAR(2) NOT NULL
);

CREATE TABLE Publisher (
  pname       VARCHAR2(20),
  country     CHAR(2),
  address     VARCHAR2(30),
  established DATE,
  PRIMARY KEY (pname, country),
  FOREIGN KEY (address) REFERENCES Publisher_Location(address)
  ON DELETE SET NULL
);

CREATE TABLE Magazine (
  ISSN     CHAR(8) PRIMARY KEY,
  mname    VARCHAR2(200),
  genre    VARCHAR2(20),
  language VARCHAR2(20),
  pname    VARCHAR2(20) NOT NULL,
  country  CHAR(2) NOT NULL,
  UNIQUE (mname, pname, country),
  FOREIGN KEY (pname, country) REFERENCES Publisher(pname, country)
  ON DELETE CASCADE
);

CREATE TABLE Issue (
  issuenum   INTEGER,
  ISSN       CHAR(8),
  issuetitle VARCHAR2(200),
  length     INTEGER,
  pdate      DATE,
  PRIMARY KEY (issuenum, ISSN),
  UNIQUE (issuetitle, pdate, ISSN),
  FOREIGN KEY (ISSN) REFERENCES Magazine(ISSN)
  ON DELETE CASCADE
);

CREATE TABLE Article_PageRange (
  pagestart INTEGER,
  pageend   INTEGER,
  pagecount INTEGER,
  PRIMARY KEY (pagestart, pageend)
);

CREATE TABLE Article (
  doi       VARCHAR2 (20) PRIMARY KEY,
  header    VARCHAR2(200),
  pagestart INTEGER,
  pageend   INTEGER,
  issuenum  INTEGER NOT NULL,
  ISSN      CHAR(8) NOT NULL,
  FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
  ON DELETE CASCADE,
  FOREIGN KEY (pagestart, pageend) REFERENCES    Article_PageRange(pagestart, pageend)
  ON DELETE SET NULL
);

CREATE TABLE Photo_FileType (
  filename VARCHAR2(20) PRIMARY KEY,
  filetype CHAR(5)
);

CREATE TABLE Photo (
  pid      INTEGER PRIMARY KEY,
  filename VARCHAR2(20),
  filesize INTEGER,
  FOREIGN KEY (filename) REFERENCES Photo_FileType(filename)
  ON DELETE SET NULL
);

CREATE TABLE Contains (
  doi    VARCHAR2(20),
  pid    INTEGER,
  PRIMARY KEY (doi, pid),
  FOREIGN KEY (doi) REFERENCES Article(doi)
  ON DELETE CASCADE,
  FOREIGN KEY (pid) REFERENCES Photo(pid)
  ON DELETE CASCADE
);

CREATE TABLE Birthday_Age (
  birthday DATE PRIMARY KEY,
  age      INTEGER
);

CREATE TABLE Contributor_EmailDetails (
  email    VARCHAR2(20) PRIMARY KEY,
  agency   VARCHAR2(20),
  cname    VARCHAR2(20),
  address  VARCHAR2(30),
  birthday DATE,
  FOREIGN KEY (birthday) REFERENCES Birthday_Age(birthday)
  ON DELETE SET NULL
);

CREATE TABLE Contributor (
  sin   CHAR(9) PRIMARY KEY,
  email VARCHAR2(20) NOT NULL,
  UNIQUE (email),
  FOREIGN KEY (email) REFERENCES Contributor_EmailDetails(email)
  ON DELETE CASCADE
);

CREATE TABLE Author (
  sin CHAR(9) PRIMARY KEY,
  FOREIGN KEY (sin) REFERENCES Contributor(sin)
  ON DELETE CASCADE
);

CREATE TABLE Photographer (
  sin CHAR(9) PRIMARY KEY,
  FOREIGN KEY (sin) REFERENCES Contributor(sin)
  ON DELETE CASCADE
);

CREATE TABLE Model (
  sin    CHAR(9) PRIMARY KEY,
  height INTEGER,
  FOREIGN KEY (sin) REFERENCES Contributor(sin)
  ON DELETE CASCADE
);

CREATE TABLE Photographed (
  sin    CHAR(9),
  pid    INTEGER,
  camtype VARCHAR2(20),
  PRIMARY KEY (sin, pid),
  FOREIGN KEY (sin) REFERENCES Photographer(sin)
  ON DELETE CASCADE,
  FOREIGN KEY (pid) REFERENCES Photo(pid)
  ON DELETE CASCADE
);

CREATE TABLE WorkedOn (
  sin      CHAR(9),
  issuenum INTEGER,
  ISSN     CHAR(8),
  PRIMARY KEY (sin, issuenum, ISSN),
  FOREIGN KEY (sin) REFERENCES Contributor(sin)
  ON DELETE CASCADE,
  FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
  ON DELETE CASCADE
);

CREATE TABLE Clothes_Price (
  designer VARCHAR2(20),
  ctype    VARCHAR2(20),
  price    INTEGER,
  PRIMARY KEY (designer, ctype)
);

CREATE TABLE Clothes (
  cid      INTEGER PRIMARY KEY,
  ctype    VARCHAR2(20),
  cfit     VARCHAR2(20),
  designer VARCHAR2(20),
  FOREIGN KEY (designer, ctype) REFERENCES Clothes_Price(designer, ctype)
  ON DELETE SET NULL
);

CREATE TABLE AppearsIn (
  cid      INTEGER,
  issuenum INTEGER,
  ISSN     CHAR(8),
  PRIMARY KEY (cid, issuenum, ISSN),
  FOREIGN KEY (cid) REFERENCES Clothes(cid)
  ON DELETE CASCADE,
  FOREIGN KEY (issuenum, ISSN) REFERENCES Issue(issuenum, ISSN)
  ON DELETE CASCADE
);

CREATE TABLE Wears (
  sin  CHAR(9),
  cid  INTEGER,
  csize CHAR(20),
  fit  VARCHAR2(20),
  PRIMARY KEY (sin, cid),
  FOREIGN KEY (sin) REFERENCES Model(sin)
  ON DELETE CASCADE,
  FOREIGN KEY (cid) REFERENCES Clothes(cid)
  ON DELETE CASCADE
);

CREATE TABLE Brand (
  bname       VARCHAR2(20) PRIMARY KEY,
  established DATE,
  country     CHAR(2),
  owner       VARCHAR2(20)
);

CREATE TABLE Branded (
  bname VARCHAR2(20),
  cid   INTEGER,
  PRIMARY KEY (bname, cid),
  FOREIGN KEY (bname) REFERENCES Brand(bname)
  ON DELETE CASCADE,
  FOREIGN KEY (cid) REFERENCES Clothes(cid)
  ON DELETE CASCADE
);


-- INSERT INTO Publisher_Location

INSERT INTO Publisher_Location 
VALUES ('1st St','New York','US');

INSERT INTO Publisher_Location 
VALUES ('2nd St','Vancouver','CA');

INSERT INTO Publisher_Location 
VALUES ('3rd St','London','UK');

INSERT INTO Publisher_Location 
VALUES ('4th St','Paris','FR');

INSERT INTO Publisher_Location 
VALUES ('5th St','Tokyo','JP');

-- INSERT INTO Publisher

INSERT INTO Publisher
VALUES ('Vogue', 'US', '1st St', DATE '2012-01-01');

INSERT INTO Publisher
VALUES ('Marie Claire', 'CA', '2nd St', DATE '2020-03-26');

INSERT INTO Publisher
VALUES ('Elle', 'UK', '3rd St', DATE '1995-11-29');

INSERT INTO Publisher
VALUES ('Glamour','FR','4th St', DATE '2025-07-28');

INSERT INTO Publisher
VALUES ('InStyle', 'JP', '5th St', DATE '2000-12-25');

-- INSERT INTO Magazine

INSERT INTO Magazine
VALUES ('12345678', 'The American Vogue', 'Fashion', 'English', 'Vogue', 'US');

INSERT INTO Magazine
VALUES ('87654321', 'Trending Accessories', 'Trends', 'English', 'Marie Claire', 'CA');

INSERT INTO Magazine
VALUES ('92096390', 'Elle Couture', 'Style', 'English', 'Elle', 'UK');

INSERT INTO Magazine
VALUES ('82371382', 'La Semaine de Choissures', 'Shoes', 'French', 'Glamour', 'FR');

INSERT INTO Magazine
VALUES ('10293847', 'InStyle Japan', 'Fashion', 'Japanese', 'InStyle', 'JP');

-- INSERT INTO Issue
INSERT INTO Issue
VALUES (1, '12345678', 'January 2025 Issue', 120, DATE '2025-01-01');

INSERT INTO Issue
VALUES (2, '10293847', 'February 2025 Issue', 110, DATE '2025-02-01');

INSERT INTO Issue
VALUES (1, '87654321', 'March 2025 Accessories', 95, DATE '2025-03-01');

INSERT INTO Issue
VALUES (1, '92096390', 'Spring Couture', 130, DATE '2025-04-01');

INSERT INTO Issue
VALUES (1, '82371382', 'Summer Shoes Special', 80, DATE '2026-06-01');

-- INSERT INTO Article_PageRange


-- INSERT INTO Article
VALUES ('001A', 'Fashion Trends 2026', 1, 5, 1, '12345678');

INSERT INTO Article
VALUES ('002B', 'Designer Spotlight', 6, 10, 1, '10293847');

INSERT INTO Article
VALUES ('003C', 'Spring Accessories', 11, 15, 1, '87654321');

INSERT INTO Article
VALUES ('004D', 'Couture Highlights', 16, 20, 1, '92096390');

INSERT INTO Article
VALUES ('005E', 'Summer Shoes Must-Haves', 21, 25, 1, '82371382');

-- INSERT INTO Photo_FileType
INSERT INTO Photo_FileType
VALUES ('img001.jpg', 'JPEG');

INSERT INTO Photo_FileType
VALUES ('img002.png', 'PNG');

INSERT INTO Photo_FileType
VALUES ('img003.tif', 'TIFF');

INSERT INTO Photo_FileType
VALUES ('img004.bmp', 'BMP');

INSERT INTO Photo_FileType
VALUES ('img005.gif', 'GIF');

-- INSERT INTO Photo
INSERT INTO Photo
VALUES (105, 'img001.jpg', 'JPEG');

INSERT INTO Photo
VALUES (101, 'img002.png', 'PNG', 4);

INSERT INTO Photo
VALUES (102, 'img003.tif', 'TIFF', 4);

INSERT INTO Photo
VALUES (103, 'img004.bmp', 'BMP', 1);

INSERT INTO Photo
VALUES (104, 'img005.gif', 'GIF', 2);

-- INSERT INTO Contains
INSERT INTO Contains
VALUES ('001A', 101);

INSERT INTO Contains
VALUES ('002B', 102);

INSERT INTO Contains
VALUES ('003C', 103);

INSERT INTO Contains
VALUES ('004D', 104);

INSERT INTO Contains
VALUES ('005E', 105);

-- INSERT INTO Birthday_Age
INSERT INTO Birthday_Age
VALUES (DATE '1990-05-12', 36);

INSERT INTO Birthday_Age
VALUES (DATE '1985-09-23', 41);

INSERT INTO Birthday_Age
VALUES (DATE '1992-11-30', 33);

INSERT INTO Birthday_Age
VALUES (DATE '2000-01-15', 26);

INSERT INTO Birthday_Age
VALUES (DATE '1998-07-08', 28);

-- INSERT INTO Contributor_EmailDetails
INSERT INTO Contributor_EmailDetails
VALUES ('alice@mail.com','FashionAgency','Alice','1st St', DATE '1990-05-12');

INSERT INTO Contributor_EmailDetails
VALUES ('bob@mail.com','StyleCorp','Bob','2nd St', DATE '1985-09-23');

INSERT INTO Contributor_EmailDetails
VALUES ('carol@mail.com','Trendsetters','Carol','3rd St', DATE '1992-11-30');

INSERT INTO Contributor_EmailDetails
VALUES ('dave@mail.com','PhotoWorld','Dave','4th St', DATE '2000-01-15');

INSERT INTO Contributor_EmailDetails
VALUES ('eve@mail.com','ModellingPro','Eve','5th St', DATE '1998-07-08');

-- INSERT INTO Contributor
INSERT INTO Contributor
VALUES ('111111111','alice@mail.com');

INSERT INTO Contributor
VALUES ('222222222','bob@mail.com');

INSERT INTO Contributor
VALUES ('333333333','carol@mail.com');

INSERT INTO Contributor
VALUES ('444444444','dave@mail.com');

INSERT INTO Contributor
VALUES ('555555555','eve@mail.com');

INSERT INTO Contributor
VALUES ('666666666','a@mail.com');

INSERT INTO Contributor
VALUES ('777777777','b@mail.com');

INSERT INTO Contributor
VALUES ('333333333','carol@mail.com');

INSERT INTO Contributor
VALUES ('444444444','dave@mail.com');

INSERT INTO Contributor
VALUES ('555555555','eve@mail.com');

-- INSERT INTO Author
INSERT INTO Author
VALUES ('111111111');

INSERT INTO Author
VALUES ('222222222');

INSERT INTO Author
VALUES ('333333333');

INSERT INTO Author
VALUES ('444444444');

INSERT INTO Author
VALUES ('555555555');

-- INSERT INTO Photographer
INSERT INTO Photographer
VALUES ('444444444');

INSERT INTO Photographer
VALUES ('222222222');

INSERT INTO Photographer
VALUES ('111111111');

INSERT INTO Photographer
VALUES ('333333333');

INSERT INTO Photographer
VALUES ('555555555');

-- INSERT INTO Model
INSERT INTO Model
VALUES ('555555555', 175);

INSERT INTO Model
VALUES ('333333333', 180);

INSERT INTO Model
VALUES ('222222222', 178);

INSERT INTO Model
VALUES ('111111111', 172);

INSERT INTO Model
VALUES ('444444444', 182);

-- INSERT INTO Photographed
INSERT INTO Photographed
VALUES ('444444444', 101,'DSLR');

INSERT INTO Photographed
VALUES ('222222222', 102,'Mirrorless');

INSERT INTO Photographed
VALUES ('111111111', 103,'Film');

INSERT INTO Photographed
VALUES ('333333333', 104,'DSLR');

INSERT INTO Photographed
VALUES ('555555555', 105,'Smartphone');

-- INSERT INTO WorkedOn
INSERT INTO WorkedOn
VALUES ('111111111', 1, '12345678');

INSERT INTO WorkedOn
VALUES ('222222222', 2,'10293847');

INSERT INTO WorkedOn
VALUES ('333333333', 1,'87654321');

INSERT INTO WorkedOn
VALUES ('444444444', 1, '92096390');

INSERT INTO WorkedOn
VALUES ('555555555', 1, '82371382');


-- INSERT INTO Clothes_Price
INSERT INTO Clothes_Price
VALUES ('Gucci','Dress', 1200);

INSERT INTO Clothes_Price
VALUES ('Prada','Shoes', 800);

INSERT INTO Clothes_Price
VALUES ('Versace','Jacket', 1500);

INSERT INTO Clothes_Price
VALUES ('Dior','Hat', 400);

INSERT INTO Clothes_Price
VALUES ('Chanel','Bag', 2000);

-- INSERT INTO Clothes
INSERT INTO Clothes
VALUES (201,'Dress','Slim','Gucci');

INSERT INTO Clothes
VALUES (202,'Shoes','Regular','Prada');

INSERT INTO Clothes
VALUES (203,'Jacket','Loose','Versace');

INSERT INTO Clothes
VALUES (204,'Hat','OneSize','Dior');

INSERT INTO Clothes
VALUES (205,'Bag','Medium','Chanel');

-- INSERT INTO AppearsIn
INSERT INTO AppearsIn
VALUES (201,1,'12345678');

INSERT INTO AppearsIn
VALUES (202, 2,'10293847');

INSERT INTO AppearsIn
VALUES (203, 1,'87654321');

INSERT INTO AppearsIn
VALUES (204, 1, '92096390');

INSERT INTO AppearsIn
VALUES (205,1, '82371382');



-- INSERT INTO Wears
INSERT INTO Wears
VALUES ('555555555',201,'M','Slim');

INSERT INTO Wears
VALUES ('333333333',202,'L','Regular');

INSERT INTO Wears
VALUES ('222222222',203,'XL','Loose');

INSERT INTO Wears
VALUES ('111111111',204,'OneSize','OneSize');

INSERT INTO Wears
VALUES ('444444444',205,'M','Medium');

-- INSERT INTO Brand
INSERT INTO Brand
VALUES ('Gucci', DATE '1921-03-01','IT','Kering');

INSERT INTO Brand
VALUES ('Prada', DATE '1913-05-02','IT','Prada Group');

INSERT INTO Brand
VALUES ('Versace', DATE '1978-12-02','IT','Versace');

INSERT INTO Brand
VALUES ('Dior', DATE '1946-12-16','FR','LVMH');

INSERT INTO Brand
VALUES ('Chanel', DATE '1910-08-19','FR','Chanel');

-- INSERT INTO Branded
INSERT INTO Branded
VALUES ('Gucci',201);

INSERT INTO Branded
VALUES ('Prada',202);

INSERT INTO Branded
VALUES ('Versace',203);

INSERT INTO Branded
VALUES ('Dior',204);

INSERT INTO Branded
VALUES ('Chanel',205);

