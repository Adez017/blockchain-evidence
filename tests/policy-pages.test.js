// Set required env vars BEFORE importing the app
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'test-key-for-jest';

const request = require('supertest');
const app = require('../server');

describe('Policy Pages - Static File Serving', () => {
  it('GET /privacy.html should return 200', async () => {
    const res = await request(app).get('/privacy.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Privacy Policy');
  });

  it('GET /terms_of_service.html should return 200', async () => {
    const res = await request(app).get('/terms_of_service.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Terms of Service');
  });

  it('GET /security_policy.html should return 200', async () => {
    const res = await request(app).get('/security_policy.html');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Security Policy');
  });

  it('GET /privacy.html should not reference missing favicon.png', async () => {
    const res = await request(app).get('/privacy.html');
    expect(res.text).not.toContain('favicon.png');
  });

  it('GET /terms_of_service.html should not reference missing favicon.png', async () => {
    const res = await request(app).get('/terms_of_service.html');
    expect(res.text).not.toContain('favicon.png');
  });

  it('GET /security_policy.html should not reference missing favicon.png', async () => {
    const res = await request(app).get('/security_policy.html');
    expect(res.text).not.toContain('favicon.png');
  });

  it('GET /index.html Legal section should not have duplicate Terms of Service links', async () => {
    const res = await request(app).get('/index.html');
    expect(res.statusCode).toBe(200);
    const termsMatches = (res.text.match(/href="terms\.html"/g) || []).length;
    expect(termsMatches).toBe(0);
  });

  it('GET /index.html Legal section should not have duplicate Security Policy links', async () => {
    const res = await request(app).get('/index.html');
    expect(res.statusCode).toBe(200);
    const securityMatches = (res.text.match(/href="security\.html"/g) || []).length;
    expect(securityMatches).toBe(0);
  });

  it('GET /index.html should link to terms_of_service.html', async () => {
    const res = await request(app).get('/index.html');
    expect(res.text).toContain('href="terms_of_service.html"');
  });

  it('GET /index.html should link to security_policy.html', async () => {
    const res = await request(app).get('/index.html');
    expect(res.text).toContain('href="security_policy.html"');
  });
});
