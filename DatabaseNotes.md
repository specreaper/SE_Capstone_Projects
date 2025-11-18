# What Is A Database
* A database is a collection of data.
* You typically use databases to create a uniform data mangement system.
* Some problems with databases is they need to be carefully managed, so you don't have to run into these problems: corrupted data, lost data, conflicting data, and even data getting stolen.
* There are main two types of databases: Relational and Non-Relational.

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

| Set Operations | Discriptions | Relational Operations | Discriptions |
|----------------|--------------|-----------------------|--------------|
| **Union** | Extracts all data from two tables and combines them into one table | **Projection** | Extracts columns from a table |
| **Difference** | Extracts all rows from one table that isn't present in the second table | **Selection** | Extracts rows from a table |
| **Intersection** | Extracts all rows that a present in both of the two tables provided | **Join** | Extracts and combines two tables with at least one common key into one table | 
| **Cartesian Product** | Exracts and combines everything on one table with everything on another table | **Division** | "Extracts rows whose column values match those in the second table, but only returns columns that don't exist in the second table" |

# E-R Model
* E-R Model stands for Enity Relationship Model. 

# SQL

# Operating A Database