{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 (async function () \{\
  const mount = document.getElementById('site-header');\
  if (!mount) return;\
\
  try \{\
    const res = await fetch('/partials/header.html', \{ cache: 'no-store' \});\
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);\
    const html = await res.text();\
    mount.innerHTML = html;\
\
    // Highlight current page link (handles /index.html)\
    const path = location.pathname.replace(/index\\.html$/, '');\
    const links = mount.querySelectorAll('.nav-links a, #mobile-nav a');\
    links.forEach(a => \{\
      const href = a.getAttribute('href');\
      if (!href || href.startsWith('http')) return;\
      const normalized = href.replace(/index\\.html$/, '').replace(/\\/+$/, '/') || '/';\
      const current = (path.endsWith('/') ? path : path + '/');\
      if (normalized === '/' ? current === '/' : current.startsWith(normalized)) \{\
        a.classList.add('active');\
      \}\
    \});\
\
    // Mobile menu toggle\
    const btn = mount.querySelector('.menu-btn');\
    const mobile = mount.querySelector('#mobile-nav');\
    if (btn && mobile) \{\
      btn.addEventListener('click', () => \{\
        const expanded = btn.getAttribute('aria-expanded') === 'true';\
        btn.setAttribute('aria-expanded', String(!expanded));\
        mobile.hidden = expanded;\
      \});\
    \}\
  \} catch (e) \{\
    console.error('Header include failed', e);\
  \}\
\})();\
}