const express = require('express')
const slugify = require('slugify')
const router = express.Router()
const ExpressError = require('../expressError')
const db = require('../db')


router.get('/', async (req, res, next) => {
   try {
      const results = await db.query(
         'SELECT code, name FROM companies ORDER BY name'
      )
      return res.json({ companies: results.rows })
   } catch (err) {
      return next(err)
   }
})

router.get('/:code', async (req, res, next) => {
   try {
      let { code } = req.params
      let respCompany = await db.query(
         'SELECT code, name, description FROM companies WHERE code = $1', [code])
      let respInvoices = await db.query(
         `SELECT id FROM invoices WHERE comp_code = $1`, [code])
      let respIndustries = await db.query(
         `SELECT i.industry
            FROM industries AS i
            LEFT JOIN companies_industries AS ci
            ON i.code = ci.ind_code
            LEFT JOIN companies AS c
            ON ci.comp_code = c.code
            WHERE c.code = $1`, [code])

      if (respCompany.rows.length === 0) {
         throw new ExpressError(`No company found with code ${code}`, 404)
      }

      let company = respCompany.rows[0]
      let invoices = respInvoices.rows
      let industries = respIndustries.rows

      company.invoices = invoices.map(invoice => invoice.id);
      company.industries = industries.map(ind => ind.industry);

      return res.json({ "company": company })
   } catch (err) {
      return next(err)
   }
})

router.post('/', async (req, res, next) => {
   try {
      let { name, description } = req.body
      let code = slugify(name, { lower: true })
      const results = await db.query(
         'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]
      )
      return res.status(201).json({ companies: results.rows[0] })
   } catch (err) {
      return next(err)
   }
})

router.put('/:code', async (req, res, next) => {
   try {
      const { code } = req.params
      const { name, description } = req.body
      const results = await db.query(
         'UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description', [name, description, code]
      )
      if (results.rows.length === 0) {
         throw new ExpressError(`Can't update company with code of ${code}`, 404)
      }
      return res.json({ company: results.rows[0] })
   } catch (err) {
      return next(err)
   }
})

router.delete('/:code', async (req, res, next) => {
   try {
      const results = await db.query(
         'DELETE FROM companies WHERE code = $1', [req.params.code]
      )
      return res.send({ status: 'Deleted' })
   } catch (err) {
      return next(err)
   }
})

module.exports = router