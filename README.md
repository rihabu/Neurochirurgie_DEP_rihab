<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Neurochirurgie DEP</title>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');

:root{
    --bg:#0f172a;
    --card:#111827;
    --accent:#06b6d4;
    --accent2:#8b5cf6;
    --text:#f8fafc;
    --muted:#94a3b8;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    font-family:'Inter',sans-serif;
    background:linear-gradient(135deg,#020617,#0f172a,#111827);
    color:var(--text);
    line-height:1.7;
}

.container{
    max-width:1000px;
    margin:auto;
    padding:40px 24px;
}

.hero{
    text-align:center;
    padding:80px 20px;
}

.badge{
    display:inline-block;
    padding:8px 18px;
    border-radius:999px;
    background:rgba(6,182,212,.15);
    border:1px solid rgba(6,182,212,.3);
    color:#67e8f9;
    font-size:.9rem;
    margin-bottom:20px;
}

h1{
    font-size:4rem;
    font-weight:800;
    background:linear-gradient(90deg,#67e8f9,#8b5cf6,#ec4899);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

.subtitle{
    margin-top:20px;
    color:var(--muted);
    font-size:1.2rem;
    max-width:700px;
    margin-left:auto;
    margin-right:auto;
}

.card{
    background:rgba(17,24,39,.75);
    backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,.08);
    border-radius:24px;
    padding:32px;
    margin-bottom:24px;
}

h2{
    margin-bottom:16px;
    font-size:1.6rem;
    color:#67e8f9;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
    margin-top:20px;
}

.feature{
    padding:24px;
    border-radius:18px;
    background:linear-gradient(
        135deg,
        rgba(6,182,212,.12),
        rgba(139,92,246,.12)
    );
    border:1px solid rgba(255,255,255,.08);
}

.feature h3{
    margin-bottom:10px;
}

ul{
    padding-left:20px;
}

li{
    margin-bottom:8px;
}

.footer{
    text-align:center;
    padding:50px 20px;
    color:var(--muted);
}

.author{
    background:linear-gradient(
        135deg,
        rgba(6,182,212,.15),
        rgba(139,92,246,.15)
    );
    border-radius:20px;
    padding:24px;
    text-align:center;
}

.highlight{
    color:#67e8f9;
    font-weight:600;
}
</style>
</head>

<body>

<div class="container">

    <section class="hero">
        <div class="badge">🧠 Neurosurgery • Digital Health • Clinical Documentation</div>

        <h1>Neurochirurgie DEP</h1>

        <p class="subtitle">
            A modern digital neurosurgical patient record concept designed to
            standardize clinical documentation, improve patient care,
            and support future research initiatives.
        </p>
    </section>

    <section class="card">
        <h2>✨ About the Project</h2>

        <p>
            Neurochirurgie DEP is a proposed electronic patient record framework
            tailored for neurosurgical practice. It aims to provide a structured,
            intuitive, and comprehensive approach to patient documentation,
            from admission to follow-up.
        </p>
    </section>

    <section class="grid">

        <div class="feature">
            <h3>📋 Clinical Documentation</h3>
            <p>
                Organized patient history, examination findings,
                imaging reports, and treatment plans.
            </p>
        </div>

        <div class="feature">
            <h3>🩻 Imaging Integration</h3>
            <p>
                Structured recording of CT, MRI, angiography,
                and other neurosurgical investigations.
            </p>
        </div>

        <div class="feature">
            <h3>⚙️ Surgical Workflow</h3>
            <p>
                Support for preoperative evaluation,
                operative documentation, and postoperative follow-up.
            </p>
        </div>

    </section>

    <section class="card">
        <h2>🎯 Vision</h2>

        <ul>
            <li>Improve documentation quality</li>
            <li>Standardize neurosurgical assessments</li>
            <li>Facilitate multidisciplinary collaboration</li>
            <li>Enable research-ready clinical datasets</li>
            <li>Lay the foundation for future AI integration</li>
        </ul>
    </section>

    <section class="card author">
        <h2>👨‍⚕️ Proposed By</h2>

        <p>
            This project was proposed by a
            <span class="highlight">Neurosurgeon</span>
            with the goal of combining clinical expertise,
            digital innovation, and modern healthcare workflows.
        </p>
    </section>

    <div class="footer">
        <p>
            © Neurochirurgie DEP • Digital Neurosurgery Documentation Platform
        </p>
    </div>

</div>

</body>
</html>
