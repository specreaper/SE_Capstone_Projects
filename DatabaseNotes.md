# What Is A Database 
**Database** = a collection of data.   
You typically use databases to create a uniform data management system.   
Some problems with databases are that they need to be carefully managed, so you don't have to run into these problems: corrupted data, lost data, conflicting data, and even data getting stolen.   

**There are three main data models:**   
* **Hierarchical Data Model** = a data model where child data only has one piece of parent data.   
* **Network Data Models** = a data model where child data can have multiple pieces of parent data.   
* **Relational Data Model** = a data model that processes data using tables.   
   
# Relational Database 
**Relational databases** = a collection of data tables and the relationship between those tables.   
   
In a relational database there are a few terms that will be explained in the following table:   
|  Term Name  | Meaning |
|-------------|---------|
| **Record**  | Table row |
| **Field**   | Table column |
| **Key**     | A field whose data is all unique and can be used to identify data |   
   
There are eight main ways to extract data from relational databases and they fall into two categories: Set Operations and Relational Operations.   
For all of the Set Operations all the fields need to be the same in both tables except when using Cartesian Product.   
Take the description of the Division operation with a grain of salt.   
   
| Set Operations | Description  | Relational Operations | Description  |
|----------------|--------------|-----------------------|--------------|
| **Union** | Extracts all data from two tables and combines them into one table | **Projection** | Extracts fields from a table |
| **Difference** | Extracts all records from one table that isn't present in the second table | **Selection** | Extracts records from a table |
| **Intersection** | Extracts all records that are present in both of the two tables provided | **Join** | Extracts and combines two tables with at least one common key into one table | 
| **Cartesian Product** | Extracts and combines everything on one table with everything on another table | **Division** | "Extracts the records whose field values match those in the second table, but only returns fields that don't exist in the second table" |   
   
# E-R Model 
**E-R Model** = a way to organize data by the relationship between entities, which also stands for Entity Relationship Model.   
There are three kinds of relationships in the E-R Model One-To-One, One-To-Many, and Many-To-Many.   
   
# Designing Databases
| Level of Normalization | Description |
|------------------------|-------------|
| **Unnormalized** | A table where duplicate items have not been removed. |
| **First Normal Form** | A simple two dimensional table with a item in each cell. |
| **Second Normal Form** | A table with a key that determines values in other fields. |
| **Third Normal Form** | A table that is divided, so that values are not determined by any non-primary key, which means all transitively dependent keys are removed. |   
   
**Two Types of keys:**   
* Functionally Dependent = a key that directly determines the values of other fields.   
* Transitively Dependent = a key that indirectly determines the values of other fields.   
   
# SQL
**SQL** = a language used to operate a relational database, which also stands for Structured Query Language.   
   
There are five distinct types of SQL commands.   
| SQL Command Type | Description |
|------------------|-------------|
| **Data Definition Language (DDL)** | Creates the table |
| **Data Manipulation Language (DML)** | Inputs and modifies data |
| **Data Query Language (DQL)** | Retrieves data |
| **Data Control Language (DCL)** | Manages user access |
| **Transaction Control Language (TCL)** | Manages transactions |   
   
## Data Definition Language (DDL) 
**CREATE TABLE __ ()** = creates a table and names it what you put in the blank and creates fields based off what you put in between the ().   
**CREATE VIEW ___ ()** = creates a virtual table that only stores a query's structure that's derived from other tables and can only be manipulated as a whole.   
**DROP VIEW ___** = deletes a view you put in the blank.   
**DROP TABLE ___** = deletes a table you put in the blank.   
**TRUNCATE TABLE ___** = removes all record values from a table.   
**ALTER ___** = changes the structure of a database.   
**RENAME ___ TO ___** = renames an object existing in a database.   
   
When you create a table you want to put constraints on it, to help you manage the database and prevent data conflicts later on.   
| Constraint | Description | Constraint | Description |
|------------|-------------|------------|-------------|
| **PRIMARY KEY** | sets a primary key and is basically a combination of UNIQUE and NOT NULL. | **UNIQUE** | ensures that all values in a field are unique. |
| **NOT NULL** | ensures that a field cannot have a NULL value | **CHECK** | ensures that the values in a field satisfies a specific condition. |
| **DEFAULT** | sets a default value for a field if no value is specified. | **FOREIGN KEY () REFERENCES ()** | sets a foreign key establishing a link between data in two tables and prevents actions that will destroy the link between them. |   
   
## Data Manipulation Language (DML)
**INSERT INTO ___** = lets you insert values into the table you put in the blank.   
**UPDATE ___** = lets you update values in the table you put in the blank.   
**DELETE FROM ___** = lets you delete values in the table you put in the blank.   
   
## Data Query Language (DQL) 
**Subquery** = queries embedded in another query.   
**Clauses** = core modifiers for how data is retrieved, filtered, grouped, and organized.   
**Aggregate Functions** = functions that perform a calculation on a set of values and returns a single numeric value.   
   
| Clauses | Description |
|---------|-------------|
| **SELECT ___** | specifies which fields in a table you want to retrieve data from, you can use * for all fields. |
| **FROM ___** | specifies which table you want to retrieve data from. |
| **WHERE ___** | is a filter that uses conditions and aggregate functions to find the data you want. |
| **HAVING ___** | is a filter that is only used with GROUP BY that uses conditions and aggregate functions to find the data you want. |
| **CASE WHEN ___** | is a filter that is used in SELECT or aggregate functions. |
| **DISTINCT ___** | returns only unique values in a field. |
| **GROUP BY ___** | returns records with similar values in the fields given in the underscore together and is usually used with aggregate functions. |   

| WHERE/CASE WHEN Conditions | Description |
|----------------------------|-------------|
| **Comparison Operators** | =, >, >=, <, <=, and <>. |
| **Logic Operators** | AND, OR, and NOT. |
| **LIKE %** | finds any string of any length, the % can be paired with other letters to find records containing something specific. |
| **LIKE _** | finds any strings whose length matches the number of underscores provided, the underscores can be paired with other letters to find record values containing something specific. |
| **BETWEEN x AND y** | finds any values between x and y |
| **IS NULL** | finds any values that are NULL |   
   
| Aggregate Functions | Description |
|---------------------|-------------|
| **Count()** | instead of returning the record values in fields that meet the conditions, only return the number of record values that meet the conditions. |
| **AVG()** | returns the averages of a set of numeric values in a field. | 
| **MIN()** | returns the minimum of a set of numeric values in a field. |
| **MAX()** | returns the maximum of a set of numeric values in a field. |   
   
## Data Control Language (DCL) 
**GRANT ___ TO ___** = grants permissions to someone.   
**REVOKE ___ TO ___** = revokes the permissions of someone.   
In the grant and revoke commands you put statements which are what you are allowing people to do, additionally apart from WITH GRANT OPTION all the statements are put in the first blank.   
| GRANT Statements | Results | Statements | Results |
|------------------|---------|------------|---------|
| **SELECT** | allows user to search for records in a table. | **INSERT** | allows user to insert records in a table. |
| **UPDATE** | allows user to update records in a table. | **DELETE** | allows user to delete records in a table. |
| **ALL** | gives user all permissions. | **WITH GRANT OPTION** | allows user to give others permissions, and this statement is put after the second blank. |   
   
## Transaction Control Language (TCL) 
**COMMIT;** = confirms changes made in a transaction into a database.   
**ROLLBACK;** = undoes changes made in a transaction in a database.   
   
There are four properties required for transactions in a database for it to work properly:   
| Property | Description | Property | Description |
|----------|-------------|----------|-------------|
| **Atomicity** | Transactions must end with either a commit or rollback operation. | **Consistency** | When processing a transaction it never results in a loss of consistency in the database. |
| **Isolation** | Even when transactions are processed concurrently, the results must be the same for sequential processing. | **Durability** | The contents of a completed transaction should not be affected by failure. |
