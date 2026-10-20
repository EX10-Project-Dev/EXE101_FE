import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import {
  merchantVenues,
  initialCampaigns,
  performance,
  analyticsDemo,
  createDemoCampaigns,
  createSampleCampaignForm
} from '../src/data/merchantDemo.js'

test('merchant demo campaigns reference real fixtures, images exist, and date/time ranges are valid', () => {
  const venueIds = new Set(merchantVenues.map(venue => venue.id))
  assert.equal(venueIds.size, merchantVenues.length)
  for (const venue of merchantVenues) {
    assert.ok(existsSync(new URL(`../public${venue.image}`, import.meta.url)))
  }
  for (const campaign of initialCampaigns) {
    assert.ok(venueIds.has(campaign.venueId))
    assert.ok(campaign.start <= campaign.end)
    assert.ok(campaign.timeFrom < campaign.timeTo)
  }
  assert.deepEqual(new Set(initialCampaigns.map(campaign => campaign.status)), new Set(['active', 'draft', 'expired']))
})

test('mock chart totals and venue analytics agree with dashboard KPIs for every period', () => {
  const number = value => Number(value.replaceAll('.', ''))
  const sum = values => values.reduce((total, value) => total + value, 0)
  for (const [period, chart] of Object.entries(performance)) {
    assert.equal(chart.dates.length, chart.impressions.length)
    assert.equal(chart.dates.length, chart.views.length)
    assert.equal(sum(chart.impressions), number(chart.kpis[0]))
    assert.equal(sum(chart.views), number(chart.kpis[1]))
    const venueMetrics = merchantVenues.map(venue => analyticsDemo[period].venueMetrics[venue.id])
    assert.equal(sum(venueMetrics.map(metric => metric.views)), number(chart.kpis[1]))
    assert.equal(sum(venueMetrics.map(metric => metric.directions)), number(chart.kpis[2]))
  }
})

test('editing demo state or prefilled form never changes seed fixtures or another demo session', () => {
  const original = structuredClone(initialCampaigns)
  const firstSession = createDemoCampaigns()
  const secondSession = createDemoCampaigns()
  firstSession[0].name = 'Tên sửa trong demo'
  firstSession.push({ id: 'new-draft' })
  const form = createSampleCampaignForm()
  assert.equal(form.audience, 'Sinh viên học nhóm')
  assert.equal(form.timeFrom, '13:00')
  assert.equal(form.timeTo, '16:00')
  assert.equal('status' in form, false)
  assert.equal('redemptions' in form, false)
  form.benefit = 'Quyền lợi đã sửa'
  assert.deepEqual(initialCampaigns, original)
  assert.deepEqual(secondSession, original)
})
