// ===== ResumeCraft — AI Resume Builder =====
(function() {
  'use strict';

  let currentTemplate = 'modern';
  let experienceCount = 1;
  let educationCount = 1;

  const sampleData = {
    fullName: 'Alex Chen',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    summary: 'Full-stack engineer with 6+ years of experience building scalable web applications. Passionate about clean code, developer tools, and mentoring junior developers. Led teams of up to 8 engineers at startups and Fortune 500 companies.',
    experiences: [
      { title: 'Senior Software Engineer', company: 'TechCorp Inc.', duration: '2022 - Present', desc: ['Led migration of monolith to microservices, reducing deployment time by 60%', 'Mentored team of 5 junior engineers through code reviews and pair programming', 'Built real-time analytics dashboard serving 10K+ daily active users'] },
      { title: 'Software Engineer', company: 'StartupXYZ', duration: '2019 - 2022', desc: ['Built and launched MVP from scratch, acquiring first 10K users in 3 months', 'Implemented CI/CD pipeline reducing release cycle from 2 weeks to 2 days', 'Optimized database queries improving API response times by 45%'] },
    ],
    education: [
      { degree: 'B.S. Computer Science', school: 'University of California, Berkeley', year: '2015 - 2019' },
    ],
    skills: 'JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, GraphQL, REST APIs, Git, Agile/Scrum',
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    updatePreview();
  });

  // ===== Tab Switching =====
  window.switchTab = function(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
  };

  // ===== Experience Management =====
  window.addExperience = function() {
    const list = document.getElementById('experienceList');
    const entry = document.createElement('div');
    entry.className = 'exp-entry';
    entry.dataset.index = experienceCount++;
    entry.innerHTML = `
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" class="exp-title" placeholder="Software Engineer">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Company</label>
          <input type="text" class="exp-company" placeholder="Company Name">
        </div>
        <div class="form-group">
          <label>Duration</label>
          <input type="text" class="exp-duration" placeholder="2020 - 2023">
        </div>
      </div>
      <div class="form-group">
        <label>Description (one achievement per line)</label>
        <textarea class="exp-desc" rows="3" placeholder="• Led team of 5 engineers..."></textarea>
      </div>
    `;
    list.appendChild(entry);
  };

  // ===== Education Management =====
  window.addEducation = function() {
    const list = document.getElementById('educationList');
    const entry = document.createElement('div');
    entry.className = 'edu-entry';
    entry.dataset.index = educationCount++;
    entry.innerHTML = `
      <div class="form-group">
        <label>Degree</label>
        <input type="text" class="edu-degree" placeholder="B.S. Computer Science">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>School</label>
          <input type="text" class="edu-school" placeholder="MIT">
        </div>
        <div class="form-group">
          <label>Year</label>
          <input type="text" class="edu-year" placeholder="2018 - 2022">
        </div>
      </div>
    `;
    list.appendChild(entry);
  };

  // ===== Template Selection =====
  window.selectTemplate = function(name) {
    currentTemplate = name;
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-template="${name}"]`).classList.add('active');
    updatePreview();
  };

  window.changeTemplate = function(name) {
    selectTemplate(name);
  };

  // ===== Load Sample Data =====
  window.loadSample = function() {
    document.getElementById('fullName').value = sampleData.fullName;
    document.getElementById('jobTitle').value = sampleData.jobTitle;
    document.getElementById('email').value = sampleData.email;
    document.getElementById('phone').value = sampleData.phone;
    document.getElementById('location').value = sampleData.location;
    document.getElementById('linkedin').value = sampleData.linkedin;
    document.getElementById('summary').value = sampleData.summary;
    document.getElementById('skillsInput').value = sampleData.skills;

    // Clear and reload experiences
    const expList = document.getElementById('experienceList');
    expList.innerHTML = '';
    experienceCount = 0;
    sampleData.experiences.forEach(exp => {
      addExperience();
      const entries = expList.querySelectorAll('.exp-entry');
      const last = entries[entries.length - 1];
      last.querySelector('.exp-title').value = exp.title;
      last.querySelector('.exp-company').value = exp.company;
      last.querySelector('.exp-duration').value = exp.duration;
      last.querySelector('.exp-desc').value = exp.desc.join('\n');
    });

    updatePreview();
    showToast('Sample data loaded!');
  };

  // ===== Update Preview =====
  window.updatePreview = function() {
    const data = getFormData();
    const preview = document.getElementById('resumePreview');
    preview.innerHTML = renderResume(data);
    saveDraft();
  };

  function getFormData() {
    return {
      fullName: document.getElementById('fullName').value.trim(),
      jobTitle: document.getElementById('jobTitle').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      location: document.getElementById('location').value.trim(),
      linkedin: document.getElementById('linkedin').value.trim(),
      summary: document.getElementById('summary').value.trim(),
      skills: document.getElementById('skillsInput').value.split(',').map(s => s.trim()).filter(Boolean),
      experiences: Array.from(document.querySelectorAll('.exp-entry')).map(e => ({
        title: e.querySelector('.exp-title').value.trim(),
        company: e.querySelector('.exp-company').value.trim(),
        duration: e.querySelector('.exp-duration').value.trim(),
        desc: e.querySelector('.exp-desc').value.split('\n').filter(d => d.trim()),
      })),
      education: Array.from(document.querySelectorAll('.edu-entry')).map(e => ({
        degree: e.querySelector('.edu-degree').value.trim(),
        school: e.querySelector('.edu-school').value.trim(),
        year: e.querySelector('.edu-year').value.trim(),
      })),
    };
  }

  function renderResume(data) {
    const contactParts = [];
    if (data.email) contactParts.push(data.email);
    if (data.phone) contactParts.push(data.phone);
    if (data.location) contactParts.push(data.location);
    if (data.linkedin) contactParts.push(data.linkedin);

    let html = `<div class="resume-${currentTemplate}">`;

    // Header
    html += `<div class="res-header">
      <div class="res-name">${escapeHtml(data.fullName || 'Your Name')}</div>
      ${data.jobTitle ? `<div class="res-title">${escapeHtml(data.jobTitle)}</div>` : ''}
      ${contactParts.length ? `<div class="res-contact">${contactParts.map(c => escapeHtml(c)).join(' • ')}</div>` : ''}
    </div>`;

    // Summary
    if (data.summary) {
      html += `<div class="res-section">
        <div class="res-section-title">Summary</div>
        <div class="res-summary">${escapeHtml(data.summary)}</div>
      </div>`;
    }

    // Experience
    if (data.experiences.length > 0) {
      html += `<div class="res-section">
        <div class="res-section-title">Experience</div>`;
      data.experiences.forEach(exp => {
        html += `<div class="res-entry">
          <div class="res-entry-header">
            <div>
              <div class="res-entry-title">${escapeHtml(exp.title)}</div>
              <div class="res-entry-subtitle">${escapeHtml(exp.company)}${exp.duration ? ' | ' + escapeHtml(exp.duration) : ''}</div>
            </div>
          </div>
          ${exp.desc.length ? `<ul class="res-entry-desc">${exp.desc.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
        </div>`;
      });
      html += `</div>`;
    }

    // Education
    if (data.education.length > 0) {
      html += `<div class="res-section">
        <div class="res-section-title">Education</div>`;
      data.education.forEach(edu => {
        html += `<div class="res-entry">
          <div class="res-entry-header">
            <div>
              <div class="res-entry-title">${escapeHtml(edu.degree)}</div>
              <div class="res-entry-subtitle">${escapeHtml(edu.school)}${edu.year ? ' • ' + escapeHtml(edu.year) : ''}</div>
            </div>
          </div>
        </div>`;
      });
      html += `</div>`;
    }

    // Skills
    if (data.skills.length > 0) {
      html += `<div class="res-section">
        <div class="res-section-title">Skills</div>
        <div class="res-skills">${data.skills.map(s => `<span class="res-skill-tag">${escapeHtml(s)}</span>`).join('')}</div>
      </div>`;
    }

    html += `</div>`;
    return html;
  }

  // ===== PDF Download =====
  window.downloadPDF = function() {
    const printWindow = window.open('', '_blank');
    const preview = document.getElementById('resumePreview').innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>${escapeHtml(getFormData().fullName || 'Resume')}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',sans-serif;padding:40px;color:#1a1a2e;font-size:13px;line-height:1.6}.res-header{text-align:center;padding-bottom:16px;border-bottom:2px solid #4f46e5;margin-bottom:16px}.res-name{font-size:24px;font-weight:800;color:#4f46e5}.res-title{font-size:14px;color:#6b7280;margin-top:4px}.res-contact{font-size:11px;color:#6b7280;margin-top:8px;display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.res-section{margin-bottom:16px}.res-section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#4f46e5;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}.res-entry{margin-bottom:10px}.res-entry-title{font-size:14px;font-weight:700}.res-entry-subtitle{font-size:12px;color:#6b7280;margin-top:2px}.res-entry-desc{font-size:12px;color:#4b5563;margin-top:4px;padding-left:16px}ul{margin:0}.res-skills{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.res-skill-tag{background:#eef2ff;color:#4f46e5;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:500}.res-summary{font-size:12px;color:#4b5563;line-height:1.6;border-left:3px solid #4f46e5;padding-left:10px}@media print{body{padding:20px}}</style>
      </head><body>${preview}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // ===== Utilities =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2000);
  }

  // ===== Persistence =====
  function saveDraft() {
    try {
      const data = getFormData();
      localStorage.setItem('resumecraft_draft', JSON.stringify({
        ...data,
        template: currentTemplate,
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function loadDraft() {
    try {
      const d = localStorage.getItem('resumecraft_draft');
      if (!d) return;
      const data = JSON.parse(d);
      if (Date.now() - data.ts > 86400000) return; // Only restore within 24 hours

      document.getElementById('fullName').value = data.fullName || '';
      document.getElementById('jobTitle').value = data.jobTitle || '';
      document.getElementById('email').value = data.email || '';
      document.getElementById('phone').value = data.phone || '';
      document.getElementById('location').value = data.location || '';
      document.getElementById('linkedin').value = data.linkedin || '';
      document.getElementById('summary').value = data.summary || '';
      document.getElementById('skillsInput').value = (data.skills || []).join(', ');

      if (data.template) {
        currentTemplate = data.template;
        document.getElementById('templateSelect').value = data.template;
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        const activeCard = document.querySelector(`[data-template="${data.template}"]`);
        if (activeCard) activeCard.classList.add('active');
      }
    } catch (e) {}
  }

  // Auto-save on input
  document.querySelectorAll('.input-panel input, .input-panel textarea').forEach(el => {
    el.addEventListener('input', () => {
      try { localStorage.setItem('resumecraft_form_state', 'dirty'); } catch(e) {}
    });
  });

})();
