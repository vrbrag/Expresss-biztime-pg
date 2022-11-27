\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS companies_industries CASCADE;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);


CREATE TABLE industries (
    code TEXT PRIMARY KEY,
    industry TEXT NOT NULL UNIQUE
);

CREATE TABLE companies_industries (
    comp_code TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    ind_code TEXT NOT NULL REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY (comp_code, ind_code)
);

INSERT INTO industries
  VALUES ('acct', 'Accounting'),
        ('soft', 'Software'),
        ('hard', 'Hardware'),
        ('ent', 'Entertainment');

INSERT INTO companies_industries
VALUES ('apple', 'soft'),
      ('apple', 'hard'),
      ('apple', 'ent'),
      ('ibm', 'acct'),
      ('ibm', 'hard');