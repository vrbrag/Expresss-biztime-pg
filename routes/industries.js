const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('', async (req, res, next) => {
   try {
      const respIndustries = await db.query(
         `SELECT i.industry, ci.comp_code
         FROM industries AS i
         JOIN companies_industries AS ci
         ON i.code = ci.ind_code
         ORDER BY i.industry`)
      let industries = respIndustries.rows.map(i => i.industry)

      return res.json({ "industries": industries })
      // const results = await db.query(
      //    `SELECT * FROM industries`
      // )
      // return res.send(results.rows)
   } catch (e) {
      return next(e)
   }
})

router.post('', async (req, res, next) => {
   try {
      let { code, industry } = req.body
      const respIndustries = await db.query(
         `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`, [code, industry])

      return res.status(201).json({ "industry": respIndustries.rows[0] })
   } catch (e) {
      return next(e)
   }
})

module.exports = router