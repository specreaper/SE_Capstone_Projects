# What Is A Database
* **Database** = a collection of data.   
* You typically use databases to create a uniform data mangement system.   
* Some problems with databases is they need to be carefully managed, so you don't have to run into these problems: corrupted data, lost data, conflicting data, and even data getting stolen.   
**There are three main data models:**   
* **Hierarchical Data Model** = a data model where child data only has one piece of parent data.   
* **Network Data Models** = a data model where child data can have multiple pieces of parent data.   
* **Relational Data Model** = a data model that processes data using tables.   

# Relational Database 
* Relational databases are a collection of data tables and the relationship between those tables.   
* In a relational database there are few terms that will be explained in the following table:   

|  Term Name  | Meaning |
|-------------|---------|
| **Record**  | Table row |
| **Field**   | Table column |
| **Key**     | A field whose data is all unique and can be used to identify data |

* There are eight main ways to extract data from relational databases and they fall into two catagories: Set Operations and Relational Operations.   
* For all of the Set Operations all the fields need to be the same in both tables except when using Cartesian Product.   
* Take the description of the Division operation with a grain of salt.   

| Set Operations | Discription  | Relational Operations | Discription  |
|----------------|--------------|-----------------------|--------------|
| **Union** | Extracts all data from two tables and combines them into one table | **Projection** | Extracts columns from a table |
| **Difference** | Extracts all rows from one table that isn't present in the second table | **Selection** | Extracts rows from a table |
| **Intersection** | Extracts all rows that are present in both of the two tables provided | **Join** | Extracts and combines two tables with at least one common key into one table | 
| **Cartesian Product** | Exracts and combines everything on one table with everything on another table | **Division** | "Extracts the rows whose column values match those in the second table, but only returns columns that don't exist in the second table" |

# E-R Model
* **E-R Model** = a way to organize data by the relationship between enities, which also stands for Enity Relationship Model.   
* There are three kinds of relationships in the E-R Model One-To-One, One-To-Many, and Many-To-Many.   

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

There are three distinct types of SQL commands.   
| SQL Command Type | Discription |
|------------------|-------------|
| **Data Definition Language (DDL)** | Creates a table |
| **Data Manipulation Language (DML)** | Inputs and retrieves data |
| **Data Control Language (DCL)** | Manages user access | 

## Data Manipulation Language (DML)
* SELECT ___ = specifies which column in a table you want to retrieve data from, you can use * for all coumn.   
* FROM ___ = specifies which table you want to retrieve data from.   
* WHERE ___ = conditions that the data you want to find has.   

| SELECT Operation | Discription |
| Count() | instead of returning the records in columns that meet the conditions, only return the number of records that meet the conditions. |
| GROUP by ___ | enables grouping allowing you to put multiple column options into SELECT and have them show up together. |

| WHERE Condition | Discription |
|-----------------|-------------|
| Comparison Operators | =, >, >=, <, <=, and <>. |
| Logic Operators | AND, OR, and NOT. |
| LIKE % | finds any string of any length, the % can be paired with other letters to find words contain something specific. |
| LIKE _ | finds any strings thats only the length of how many _ are provided, the _ can be paired with other letters to find words contain something specific. |
| BETWEEN x AND y | finds any values between x and y also put below the WHERE |
| is NULL | finds any values that are NULL |

# Operating A Database