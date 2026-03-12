# What Is A Database 
**Database** = a collection of data.   
You typically use databases to create a uniform data mangement system.   
Some problems with databases is they need to be carefully managed, so you don't have to run into these problems: corrupted data, lost data, conflicting data, and even data getting stolen.   

**There are three main data models:**   
* **Hierarchical Data Model** = a data model where child data only has one piece of parent data.   
* **Network Data Models** = a data model where child data can have multiple pieces of parent data.   
* **Relational Data Model** = a data model that processes data using tables.   
   
# Relational Database 
**Relational databases** = a collection of data tables and the relationship between those tables.   
   
In a relational database there are few terms that will be explained in the following table:   
|  Term Name  | Meaning |
|-------------|---------|
| **Record**  | Table row |
| **Field**   | Table column |
| **Key**     | A field whose data is all unique and can be used to identify data |   
   
There are eight main ways to extract data from relational databases and they fall into two catagories: Set Operations and Relational Operations.   
For all of the Set Operations all the fields need to be the same in both tables except when using Cartesian Product.   
Take the description of the Division operation with a grain of salt.   
   
| Set Operations | Discription  | Relational Operations | Discription  |
|----------------|--------------|-----------------------|--------------|
| **Union** | Extracts all data from two tables and combines them into one table | **Projection** | Extracts columns from a table |
| **Difference** | Extracts all rows from one table that isn't present in the second table | **Selection** | Extracts rows from a table |
| **Intersection** | Extracts all rows that are present in both of the two tables provided | **Join** | Extracts and combines two tables with at least one common key into one table | 
| **Cartesian Product** | Exracts and combines everything on one table with everything on another table | **Division** | "Extracts the rows whose column values match those in the second table, but only returns columns that don't exist in the second table" |   
   
# E-R Model 
**E-R Model** = a way to organize data by the relationship between enities, which also stands for Enity Relationship Model.   
There are three kinds of relationships in the E-R Model One-To-One, One-To-Many, and Many-To-Many.   
   
# Designing Databases
| Level of Normalization | Discription |
|------------------------|-------------|
| **Unnormalized** | A table where duplicate items have not been removed. |
| **First Normal Form** | A simple two dimensional table with a item in each cell. |
| **Second Normal Form** | A table with a key that determines values in other columns. |
| **Third Normal Form** | A table that is divided, so that a values are not determined by any non-primary key, which means all transitively dependent keys are removed. |   
   
**Two Types of keys:**   
* Functionally Dependent = a key that directly determines the values of other columns.   
* Transitively Dependent = a key that indirectly determines the values of other columns.   
   
# SQL
**SQL** = a language used to operate a relational database, which also stands for Structured Query Language.   
   
There are five distinct types of SQL commands.   
| SQL Command Type | Discription |
|------------------|-------------|
| **Data Definition Language (DDL)** | Creates the table |
| **Data Manipulation Language (DML)** | Inputs and modifies data |
| **Data Query Language (DQL)** | Retrieves data |
| **Data Control Language (DCL)** | Manages user access |
| **Transaction Control Language (TCL)** | Manages transactions |   
   
## Data Definition Language (DDL) 
**CREATE TABLE __ ()** = creates a table and names it what you put in the blank and creates columns based off what you put in between the ().   
**CREATE VIEW ___ ()** = creates a virtalual table that only stores a query's structure thats derived from other tables and can only be manipulated as a whole.   
**DROP VIEW ___** = deletes a view you put in the blank.   
**DROP TABLE ___** = delates a table you put in the blank.   
**TURNCATE TABLE ___** = removes all records from a table.   
**ALTER ___** = changes the structure of a database.   
**RENAME ___ TO ___** = renames an object existing in a database.   
   
When you create a table you want to put constraints on it, to help you manage the database and prevent data conflicts later on.   
| Constraint | Description | Constraint | Description |
|------------|-------------|------------|-------------|
| **PRIMARY KEY** | sets a primary key and is basiclly a combination of UNIQUE and NOT NULL. | **UNIQUE** | ensures that all values in a column are unique. |
| **NOT NULL** | ensures that a column cannot have a NULL value | **CHECK** | ensures that the values in a column satisfies a specific condition. |
| **DEFAULT** | sets a default value for a column if no value is specified. | **FOREIGN KEY () REFERENCES ()** | sets a foreign key establishing a link between data in two tables and prevents actions that will destroy the link between them. |   
   
## Data Manipulation Language (DML)
**INSERT INTO ___** = lets you insert values into the table you put in the blank.   
**UPDATE ___** = lets you update values in the table you put in the blank.   
**DELETE FROM ___** = lets you delete values in the table you put in the blank.   
   
## Data Query Language (DQL) 
**Subquery** = queries embeded in another query.   
   
**SELECT ___** = specifies which column in a table you want to retrieve data from, you can use * for all coumn.   
**FROM ___** = specifies which table you want to retrieve data from.   
**WHERE ___** = is a filter that uses conditions to find the data you want.   
**HAVING ___** = is a filter that uses conditions and aggregate functions to find the data you want.   

| WHERE Condition | Discription |
|-----------------|-------------|
| **Comparison Operators** | =, >, >=, <, <=, and <>. |
| **Logic Operators** | AND, OR, and NOT. |
| **LIKE %** | finds any string of any length, the % can be paired with other letters to find words contain something specific. |
| **LIKE _** | finds any strings thats only the length of how many _ are provided, the _ can be paired with other letters to find words contain something specific. |
| **BETWEEN x AND y** | finds any values between x and y also put below the WHERE |
| **is NULL** | finds any values that are NULL |   
   
| Aggregate Functions | Discription |
|---------------------|-------------|
| **Count()** | instead of returning the records in columns that meet the conditions, only return the number of records that meet the conditions. |
| **AVG()** | returns the averages of a set of numeric values in a column. | 
| **GROUP by ___** | enables grouping allowing you to put multiple column options into SELECT and have them show up together. |   
   
## Data Control Language (DCL) 
**GRANT ___ TO ___** = grants permissions to someone.   
**REVOKE ___ TO ___** = revokes the permissions of someone.   
In the grant and revoke commands you put staments which are what you are allowing people to do, additionally apart from WITH GRANT OPTION all the statements are put in the first blank.   
| Statements | Results | Statements | Results |
|------------|---------|------------|---------|
| **SELECT** | allows user to search for rows in a table. | **INSERT** | allows user to insert rows in a table. |
| **UPDATE** | allows user to update rows in a table. | **DELETE** | allows user to delete rows in a table. |
| **ALL** | gives user all permissions. | **WITH GRANT OPTION** | allows user to give others permissions, and this statement is put after the second blank. |   
   
## Transaction Control Language (TCL) 
**COMMIT;** = confirms changes made in a transaction into a database.   
**ROLLBACK;** = undoes changes made in a transaction in a database.   
   
There are four properties required for transactions in a database for it to work properly:   
| Property | Description | Property | Description |
|----------|-------------|----------|-------------|
| **Atomicity** | transactions must end with either a commit or rollback operation. | **Consistency** | when processing a transaction it never results in, a loss of consistency in the database. |
| **Isolation** | Even when transactions are processed concurrently, the results must be the same for sequential processing. | **Durability** | the contents of a completed transaction should not be affected by failure. |
