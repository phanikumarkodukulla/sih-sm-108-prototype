// Enhanced Resume Generator JavaScript with JSON Data Support
let currentUser = null;
let currentTemplate = 'modern';
let customObjective = '';
let resumeData = null;
let currentStudentData = null;

// Initialize resume generator
$(document).ready(function () {
    // Check authentication
    if (!checkAuth()) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'student') {
        window.location.href = 'index.html';
        return;
    }

    // Load resume data and initialize
    loadResumeData().then(() => {
        initializeGenerator();
    });
});

// Load resume data from JSON file
async function loadResumeData() {
    try {
        const response = await fetch('./data/resume-data.json');
        resumeData = await response.json();

        // Find current student's data
        currentStudentData = resumeData.students[currentUser.email];

        if (!currentStudentData) {
            // Fallback to default student data structure
            currentStudentData = createDefaultStudentData();
        }

        console.log('Resume data loaded for:', currentStudentData.personalInfo.name);
    } catch (error) {
        console.error('Error loading resume data:', error);
        currentStudentData = createDefaultStudentData();
        showToast('Using default resume data. Please ensure data/resume-data.json exists.', 'warning');
    }
}

// Create default student data structure
function createDefaultStudentData() {
    return {
        personalInfo: {
            name: currentUser.name || 'Student Name',
            email: currentUser.email,
            phone: '+91 9876543210',
            address: 'City, State, India',
            linkedin: 'linkedin.com/in/studentname',
            github: 'github.com/studentname',
            profileImage: currentUser.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name) + '&background=1f4e79&color=fff&size=150&bold=true'
        },
        objective: 'Passionate student seeking opportunities to apply technical skills and contribute to innovative projects.',
        education: [{
            degree: currentUser.course || 'Bachelor of Technology',
            institution: currentUser.college || 'University Name',
            duration: '2021 - 2025',
            cgpa: currentUser.cgpa || '8.5/10'
        }],
        skills: {
            programming: currentUser.skills || ['Python', 'Java', 'JavaScript'],
            web: ['HTML5', 'CSS3', 'React.js'],
            tools: ['Git', 'VS Code', 'MySQL']
        },
        projects: [],
        achievements: [],
        certificates: []
    };
}

// Initialize generator after data is loaded
function initializeGenerator() {
    // Load custom objective if exists
    const savedObjective = localStorage.getItem(`objective_${currentUser.email}`);
    if (savedObjective) {
        customObjective = savedObjective;
        $('#customObjective').val(savedObjective);
    }

    // Load saved preferences
    loadSavedPreferences();

    // Generate initial resume
    updateResume();
}

// Select template
function selectTemplate(template) {
    currentTemplate = template;
    $('.template-option').removeClass('selected');
    $(`.template-option[data-template="${template}"]`).addClass('selected');
    updateResume();
}

// Update resume preview
function updateResume() {
    if (!currentStudentData) {
        $('#resumePreview').html('<div class="text-center p-5"><div class="spinner-border" role="status"></div><p>Loading resume data...</p></div>');
        return;
    }

    let resumeHtml = '';

    switch (currentTemplate) {
        case 'modern':
            resumeHtml = generateModernTemplate();
            break;
        case 'classic':
            resumeHtml = generateClassicTemplate();
            break;
        case 'creative':
            resumeHtml = generateCreativeTemplate();
            break;
        default:
            resumeHtml = generateModernTemplate();
    }

    $('#resumePreview').html(resumeHtml);
}

// Generate Modern Template
function generateModernTemplate() {
    const data = currentStudentData;
    const personalInfo = data.personalInfo;

    let html = `
        <div class="modern-header" style="background: linear-gradient(135deg, #1f4e79 0%, #2d5016 100%); color: white; padding: 40px 30px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; z-index: 1;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; z-index: 1;"></div>
            <div style="display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 2;">
                <div style="flex: 1;">
                    <h1 style="font-size: 36px; font-weight: 700; margin: 0 0 10px 0; color: white;">${personalInfo.name}</h1>
                    <p style="font-size: 18px; margin: 0 0 15px 0; color: #e2e8f0; font-weight: 500;">${data.education[0]?.degree || 'Student'}</p>
                    <p style="font-size: 16px; margin: 0; color: #cbd5e0;">${data.education[0]?.institution || ''}</p>
                </div>
                <div style="margin-left: 30px;">
                    <img src="${personalInfo.profileImage}" alt="${personalInfo.name}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid rgba(255,255,255,0.3); object-fit: cover; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                </div>
            </div>
            <div style="margin-top: 25px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; position: relative; z-index: 2;">
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <i class="fas fa-envelope" style="width: 20px; margin-right: 12px; color: #ffd700;"></i>
                    <span style="font-size: 14px;">${personalInfo.email}</span>
                </div>
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <i class="fas fa-phone" style="width: 20px; margin-right: 12px; color: #ffd700;"></i>
                    <span style="font-size: 14px;">${personalInfo.phone}</span>
                </div>
                ${personalInfo.linkedin ? `
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <i class="fab fa-linkedin" style="width: 20px; margin-right: 12px; color: #ffd700;"></i>
                    <span style="font-size: 14px;">${personalInfo.linkedin}</span>
                </div>
                ` : ''}
                ${personalInfo.github ? `
                <div style="display: flex; align-items: center; color: #e2e8f0;">
                    <i class="fab fa-github" style="width: 20px; margin-right: 12px; color: #ffd700;"></i>
                    <span style="font-size: 14px;">${personalInfo.github}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Objective Section
    if ($('#includeObjective').is(':checked')) {
        const objective = customObjective || data.objective;
        html += `
            <div class="resume-section" style="padding: 30px; border-left: 4px solid #1f4e79; margin: 0; background: #f8fafc;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 15px 0; display: flex; align-items: center;">
                    <i class="fas fa-bullseye" style="margin-right: 12px; color: #2d5016;"></i>
                    Professional Objective
                </h3>
                <p style="margin: 0; line-height: 1.7; color: #4a5568; font-size: 15px; text-align: justify;">${objective}</p>
            </div>
        `;
    }

    // Education Section
    if ($('#includeEducation').is(':checked') && data.education) {
        html += `
            <div class="resume-section" style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-graduation-cap" style="margin-right: 12px; color: #2d5016;"></i>
                    Education
                </h3>
                ${data.education.map(edu => `
                    <div style="margin-bottom: 20px; padding: 20px; background: #f7fafc; border-radius: 8px; border-left: 3px solid #2d5016;">
                        <h5 style="font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #2d4a22;">${edu.degree}</h5>
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px; font-weight: 500;">
                            <i class="fas fa-university" style="margin-right: 8px; color: #1f4e79;"></i>
                            ${edu.institution}${edu.location ? ` • ${edu.location}` : ''}
                        </div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
                            <i class="fas fa-calendar" style="margin-right: 8px; color: #1f4e79;"></i>
                            ${edu.duration}
                        </div>
                        ${edu.cgpa ? `
                        <div style="color: #666; font-size: 14px; margin-bottom: 8px;">
                            <i class="fas fa-star" style="margin-right: 8px; color: #1f4e79;"></i>
                            CGPA: <strong>${edu.cgpa}</strong>
                        </div>
                        ` : ''}
                        ${edu.coursework ? `
                        <div style="margin-top: 12px;">
                            <strong style="color: #4a5568; font-size: 13px;">Relevant Coursework:</strong>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 13px;">${edu.coursework.join(', ')}</p>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Skills Section
    if ($('#includeSkills').is(':checked') && data.skills) {
        html += `
            <div class="resume-section" style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-code" style="margin-right: 12px; color: #2d5016;"></i>
                    Technical Skills
                </h3>
                <div style="display: grid; gap: 15px;">
                    ${Object.entries(data.skills).map(([category, skills]) => `
                        <div style="background: #f7fafc; padding: 15px; border-radius: 8px; border-left: 3px solid #1f4e79;">
                            <h6 style="font-size: 14px; font-weight: 600; color: #2d4a22; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h6>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skills.map(skill => `
                                    <span style="background: #1f4e79; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${skill}</span>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Projects Section
    if ($('#includeProjects').is(':checked') && data.projects && data.projects.length > 0) {
        html += `
            <div class="resume-section" style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-project-diagram" style="margin-right: 12px; color: #2d5016;"></i>
                    Projects
                </h3>
                ${data.projects.slice(0, 3).map(project => `
                    <div style="margin-bottom: 25px; padding: 20px; background: #f7fafc; border-radius: 8px; border-left: 3px solid #2d5016;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                            <h5 style="font-size: 16px; font-weight: 600; margin: 0; color: #2d4a22;">${project.title}</h5>
                            <span style="background: #e2e8f0; color: #4a5568; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${project.duration}</span>
                        </div>
                        <div style="color: #666; font-size: 13px; margin-bottom: 10px;">
                            <i class="fas fa-tools" style="margin-right: 8px; color: #1f4e79;"></i>
                            <strong>Technologies:</strong> ${project.technologies.join(', ')}
                        </div>
                        <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">${project.description}</p>
                        ${project.highlights ? `
                        <ul style="margin: 10px 0 0 20px; color: #4a5568; font-size: 13px;">
                            ${project.highlights.slice(0, 3).map(highlight => `<li style="margin-bottom: 5px;">${highlight}</li>`).join('')}
                        </ul>
                        ` : ''}
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            ${project.github ? `<a href="${project.github}" style="color: #1f4e79; text-decoration: none; font-size: 12px;"><i class="fab fa-github"></i> GitHub</a>` : ''}
                            ${project.demo ? `<a href="${project.demo}" style="color: #1f4e79; text-decoration: none; font-size: 12px;"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Internships Section
    if ($('#includeInternships').is(':checked') && data.internships && data.internships.length > 0) {
        html += `
            <div class="resume-section" style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-briefcase" style="margin-right: 12px; color: #2d5016;"></i>
                    Experience & Internships
                </h3>
                ${data.internships.map(internship => `
                    <div style="margin-bottom: 25px; padding: 20px; background: #f7fafc; border-radius: 8px; border-left: 3px solid #2d5016;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                            <h5 style="font-size: 16px; font-weight: 600; margin: 0; color: #2d4a22;">${internship.position}</h5>
                            <span style="background: #e2e8f0; color: #4a5568; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${internship.duration}</span>
                        </div>
                        <div style="color: #666; font-size: 14px; margin-bottom: 10px; font-weight: 500;">
                            <i class="fas fa-building" style="margin-right: 8px; color: #1f4e79;"></i>
                            ${internship.company}${internship.location ? ` • ${internship.location}` : ''}
                        </div>
                        <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px; line-height: 1.6;">${internship.description}</p>
                        ${internship.achievements ? `
                        <ul style="margin: 10px 0 0 20px; color: #4a5568; font-size: 13px;">
                            ${internship.achievements.map(achievement => `<li style="margin-bottom: 5px;">${achievement}</li>`).join('')}
                        </ul>
                        ` : ''}
                        ${internship.technologies ? `
                        <div style="margin-top: 10px; color: #666; font-size: 13px;">
                            <strong>Technologies:</strong> ${internship.technologies.join(', ')}
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Achievements Section
    if ($('#includeAchievements').is(':checked') && data.achievements && data.achievements.length > 0) {
        html += `
            <div class="resume-section" style="padding: 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-trophy" style="margin-right: 12px; color: #2d5016;"></i>
                    Achievements & Awards
                </h3>
                <div style="display: grid; gap: 15px;">
                    ${data.achievements.map(achievement => `
                        <div style="padding: 15px; background: #f7fafc; border-radius: 8px; border-left: 3px solid #ffd700;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <h5 style="font-size: 15px; font-weight: 600; margin: 0; color: #2d4a22;">${achievement.title}</h5>
                                <span style="background: #ffd700; color: #2d4a22; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${formatDate(achievement.date)}</span>
                            </div>
                            <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">${achievement.description}</p>
                            ${achievement.category ? `
                            <span style="background: #e2e8f0; color: #4a5568; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-top: 8px; display: inline-block;">${achievement.category}</span>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Certificates Section
    if ($('#includeCertificates').is(':checked') && data.certificates && data.certificates.length > 0) {
        html += `
            <div class="resume-section" style="padding: 30px;">
                <h3 style="color: #1f4e79; font-size: 20px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
                    <i class="fas fa-certificate" style="margin-right: 12px; color: #2d5016;"></i>
                    Certifications
                </h3>
                <div style="display: grid; gap: 12px;">
                    ${data.certificates.map(cert => `
                        <div style="padding: 15px; background: #f7fafc; border-radius: 8px; border-left: 3px solid #1f4e79; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h5 style="font-size: 14px; font-weight: 600; margin: 0 0 5px 0; color: #2d4a22;">${cert.title}</h5>
                                <div style="color: #666; font-size: 13px;">
                                    <span style="font-weight: 500;">${cert.issuer}</span>
                                    ${cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="background: #1f4e79; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">${formatDate(cert.date)}</div>
                                ${cert.validUntil ? `<div style="color: #666; font-size: 10px; margin-top: 2px;">Valid until ${formatDate(cert.validUntil)}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return html;
}

// Generate Classic Template
function generateClassicTemplate() {
    const data = currentStudentData;
    const personalInfo = data.personalInfo;

    let html = `
        <div style="text-align: center; padding: 40px 30px; border-bottom: 4px solid #1f4e79; background: #f8fafc;">
            <h1 style="font-size: 32px; margin: 0 0 15px 0; color: #1f4e79; font-weight: 700; letter-spacing: 1px;">${personalInfo.name.toUpperCase()}</h1>
            <p style="font-size: 16px; margin: 0 0 8px 0; color: #4a5568; font-weight: 500;">${data.education[0]?.degree || 'Student'}</p>
            <p style="font-size: 14px; margin: 0 0 15px 0; color: #666;">${data.education[0]?.institution || ''}</p>
            <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 15px;">
                <span style="color: #4a5568; font-size: 14px;"><i class="fas fa-envelope" style="color: #1f4e79; margin-right: 5px;"></i>${personalInfo.email}</span>
                <span style="color: #4a5568; font-size: 14px;"><i class="fas fa-phone" style="color: #1f4e79; margin-right: 5px;"></i>${personalInfo.phone}</span>
                ${personalInfo.address ? `<span style="color: #4a5568; font-size: 14px;"><i class="fas fa-map-marker-alt" style="color: #1f4e79; margin-right: 5px;"></i>${personalInfo.address}</span>` : ''}
            </div>
        </div>
    `;

    // Objective Section
    if ($('#includeObjective').is(':checked')) {
        const objective = customObjective || data.objective;
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 15px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Objective</h3>
                <p style="margin: 0; text-align: justify; line-height: 1.7; color: #4a5568; font-size: 14px;">${objective}</p>
            </div>
        `;
    }

    // Education Section
    if ($('#includeEducation').is(':checked') && data.education) {
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Education</h3>
                ${data.education.map(edu => `
                    <div style="margin-bottom: 20px;">
                        <h5 style="font-size: 16px; font-weight: 600; margin: 0 0 5px 0; color: #2d4a22;">${edu.degree}</h5>
                        <div style="color: #666; font-size: 14px; margin-bottom: 5px; font-weight: 500;">${edu.institution}${edu.location ? `, ${edu.location}` : ''}</div>
                        <div style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>Duration:</strong> ${edu.duration}</div>
                        ${edu.cgpa ? `<div style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>CGPA:</strong> ${edu.cgpa}</div>` : ''}
                        ${edu.percentage ? `<div style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>Percentage:</strong> ${edu.percentage}</div>` : ''}
                        ${edu.coursework ? `<div style="margin-top: 8px; color: #4a5568; font-size: 13px;"><strong>Relevant Coursework:</strong> ${edu.coursework.join(', ')}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Skills Section
    if ($('#includeSkills').is(':checked') && data.skills) {
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Technical Skills</h3>
                ${Object.entries(data.skills).map(([category, skills]) => `
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #2d4a22; font-size: 14px; text-transform: capitalize;">${category.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                        <span style="color: #4a5568; font-size: 14px; margin-left: 10px;">${skills.join(', ')}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Projects Section
    if ($('#includeProjects').is(':checked') && data.projects && data.projects.length > 0) {
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Projects</h3>
                ${data.projects.slice(0, 3).map(project => `
                    <div style="margin-bottom: 20px;">
                        <h5 style="font-size: 15px; font-weight: 600; margin: 0 0 5px 0; color: #2d4a22;">${project.title}</h5>
                        <div style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>Duration:</strong> ${project.duration} | <strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
                        <p style="margin: 5px 0 8px 0; color: #4a5568; font-size: 14px; text-align: justify;">${project.description}</p>
                        ${project.highlights ? `
                        <ul style="margin: 8px 0 0 20px; color: #4a5568; font-size: 13px;">
                            ${project.highlights.slice(0, 2).map(highlight => `<li style="margin-bottom: 3px;">${highlight}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Experience Section
    if ($('#includeInternships').is(':checked') && data.internships && data.internships.length > 0) {
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Experience</h3>
                ${data.internships.map(internship => `
                    <div style="margin-bottom: 20px;">
                        <h5 style="font-size: 15px; font-weight: 600; margin: 0 0 5px 0; color: #2d4a22;">${internship.position}</h5>
                        <div style="color: #666; font-size: 14px; margin-bottom: 5px; font-weight: 500;">${internship.company}${internship.location ? `, ${internship.location}` : ''}</div>
                        <div style="color: #666; font-size: 13px; margin-bottom: 8px;"><strong>Duration:</strong> ${internship.duration}</div>
                        <p style="margin: 5px 0 8px 0; color: #4a5568; font-size: 14px; text-align: justify;">${internship.description}</p>
                        ${internship.achievements ? `
                        <ul style="margin: 8px 0 0 20px; color: #4a5568; font-size: 13px;">
                            ${internship.achievements.map(achievement => `<li style="margin-bottom: 3px;">${achievement}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Achievements Section
    if ($('#includeAchievements').is(':checked') && data.achievements && data.achievements.length > 0) {
        html += `
            <div style="padding: 25px 30px; border-bottom: 1px solid #e2e8f0;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Achievements</h3>
                ${data.achievements.map(achievement => `
                    <div style="margin-bottom: 15px;">
                        <h5 style="font-size: 14px; font-weight: 600; margin: 0 0 3px 0; color: #2d4a22;">${achievement.title}</h5>
                        <div style="color: #666; font-size: 13px; margin-bottom: 5px;"><strong>Date:</strong> ${formatDate(achievement.date)} | <strong>Category:</strong> ${achievement.category}</div>
                        <p style="margin: 0; color: #4a5568; font-size: 13px;">${achievement.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Certificates Section
    if ($('#includeCertificates').is(':checked') && data.certificates && data.certificates.length > 0) {
        html += `
            <div style="padding: 25px 30px;">
                <h3 style="color: #1f4e79; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #2d5016; padding-bottom: 8px;">Certifications</h3>
                ${data.certificates.map(cert => `
                    <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h5 style="font-size: 14px; font-weight: 600; margin: 0 0 3px 0; color: #2d4a22;">${cert.title}</h5>
                            <div style="color: #666; font-size: 13px;">${cert.issuer}${cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}</div>
                        </div>
                        <div style="color: #666; font-size: 13px; text-align: right;">
                            <div><strong>${formatDate(cert.date)}</strong></div>
                            ${cert.validUntil ? `<div style="font-size: 11px;">Valid until ${formatDate(cert.validUntil)}</div>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return html;
}

// Generate Creative Template
function generateCreativeTemplate() {
    const data = currentStudentData;
    const personalInfo = data.personalInfo;

    let html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 50px 30px; position: relative; overflow: hidden;">
            <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; border: 20px solid rgba(255,255,255,0.1); border-radius: 50%; z-index: 1;"></div>
            <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.05); border-radius: 50%; z-index: 1;"></div>
            <div style="position: relative; z-index: 2; text-align: center;">
                <div style="margin-bottom: 30px;">
                    <img src="${personalInfo.profileImage}" alt="${personalInfo.name}" style="width: 100px; height: 100px; border-radius: 50%; border: 4px solid white; object-fit: cover; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                </div>
                <h1 style="font-size: 42px; margin: 0 0 15px 0; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${personalInfo.name}</h1>
                <p style="font-size: 20px; margin: 0 0 10px 0; opacity: 0.9; font-weight: 500;">${data.education[0]?.degree || 'Student'}</p>
                <p style="font-size: 16px; margin: 0 0 25px 0; opacity: 0.8;">${data.education[0]?.institution || ''}</p>
                <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 25px; backdrop-filter: blur(10px);">
                        <i class="fas fa-envelope" style="margin-right: 8px;"></i>${personalInfo.email}
                    </div>
                    <div style="background: rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 25px; backdrop-filter: blur(10px);">
                        <i class="fas fa-phone" style="margin-right: 8px;"></i>${personalInfo.phone}
                    </div>
                    ${personalInfo.linkedin ? `
                    <div style="background: rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 25px; backdrop-filter: blur(10px);">
                        <i class="fab fa-linkedin" style="margin-right: 8px;"></i>LinkedIn
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Objective Section with creative styling
    if ($('#includeObjective').is(':checked')) {
        const objective = customObjective || data.objective;
        html += `
            <div style="padding: 40px 30px; background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); color: white; position: relative;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.1); z-index: 1;"></div>
                <div style="position: relative; z-index: 2;">
                    <h3 style="color: white; font-size: 24px; font-weight: 700; margin: 0 0 20px 0; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">✨ My Vision ✨</h3>
                    <p style="margin: 0; line-height: 1.8; color: white; font-size: 16px; text-align: center; font-style: italic; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">"${objective}"</p>
                </div>
            </div>
        `;
    }

    // Skills Section with creative grid
    if ($('#includeSkills').is(':checked') && data.skills) {
        html += `
            <div style="padding: 40px 30px; background: #f8fafc;">
                <h3 style="color: #667eea; font-size: 24px; font-weight: 700; margin: 0 0 30px 0; text-align: center;">🚀 Technical Arsenal</h3>
                ${Object.entries(data.skills).map(([category, skills]) => `
                    <div style="margin-bottom: 25px; text-align: center;">
                        <h6 style="font-size: 16px; font-weight: 600; color: #764ba2; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">${category.replace(/([A-Z])/g, ' $1').trim()}</h6>
                        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;">
                            ${skills.map(skill => `
                                <span style="background: linear-gradient(45deg, #667eea, #764ba2); color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transform: perspective(1px);">${skill}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Add other sections with creative styling...
    // (Projects, Experience, etc. following similar creative patterns)

    return html;
}

// Download resume as PDF
function downloadResume() {
    showToast('Preparing PDF download...', 'info');

    const element = document.getElementById('resumePreview');

    // Use html2canvas and jsPDF for proper PDF generation
    html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: element.scrollHeight,
        width: element.scrollWidth
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Save the PDF
        const filename = `${currentStudentData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`;
        pdf.save(filename);

        showToast('Resume downloaded successfully!', 'success');
    }).catch(error => {
        console.error('Error generating PDF:', error);

        // Fallback: generate HTML file
        const resumeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${currentStudentData.personalInfo.name} - Resume</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; }
                    @media print {
                        body { margin: 0; }
                        * { box-sizing: border-box; }
                    }
                </style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            </head>
            <body>
                ${$('#resumePreview').html()}
            </body>
            </html>
        `;

        const blob = new Blob([resumeHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentStudentData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('Resume downloaded as HTML file!', 'warning');
    });
}

// Print resume
function printResume() {
    const printWindow = window.open('', '_blank');
    const resumeContent = document.getElementById('resumePreview').innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${currentStudentData.personalInfo.name} - Resume</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; }
                @media print {
                    body { margin: 0; }
                    * { box-sizing: border-box; }
                }
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        </head>
        <body>
            ${resumeContent}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Save resume template preferences
function saveResume() {
    const preferences = {
        template: currentTemplate,
        sections: {
            objective: $('#includeObjective').is(':checked'),
            education: $('#includeEducation').is(':checked'),
            skills: $('#includeSkills').is(':checked'),
            achievements: $('#includeAchievements').is(':checked'),
            certificates: $('#includeCertificates').is(':checked'),
            internships: $('#includeInternships').is(':checked'),
            projects: $('#includeProjects').is(':checked')
        },
        customObjective: customObjective
    };

    localStorage.setItem(`resume_preferences_${currentUser.email}`, JSON.stringify(preferences));
    showToast('Resume template saved!', 'success');
}

// Load saved preferences
function loadSavedPreferences() {
    const saved = localStorage.getItem(`resume_preferences_${currentUser.email}`);
    if (saved) {
        const preferences = JSON.parse(saved);

        // Apply template
        selectTemplate(preferences.template);

        // Apply section preferences
        Object.keys(preferences.sections).forEach(section => {
            $(`#include${section.charAt(0).toUpperCase() + section.slice(1)}`).prop('checked', preferences.sections[section]);
        });

        // Apply custom objective
        if (preferences.customObjective) {
            customObjective = preferences.customObjective;
            $('#customObjective').val(customObjective);
        }

        updateResume();
    }
}

// Save custom objective
function saveObjective() {
    customObjective = $('#customObjective').val();
    localStorage.setItem(`objective_${currentUser.email}`, customObjective);
    $('#objectiveModal').modal('hide');
    updateResume();
    showToast('Objective saved!', 'success');
}

// Format date helper
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast if it doesn't exist
    if (!$('#toast').length) {
        $('body').append(`
            <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
                <div id="toast" class="toast" role="alert">
                    <div class="toast-header">
                        <i id="toastIcon" class="fas fa-info-circle text-primary me-2"></i>
                        <strong class="me-auto">Resume Generator</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                    </div>
                    <div class="toast-body" id="toastMessage"></div>
                </div>
            </div>
        `);
    }

    // Update toast content
    const iconClasses = {
        'success': 'fas fa-check-circle text-success',
        'error': 'fas fa-exclamation-circle text-danger',
        'warning': 'fas fa-exclamation-triangle text-warning',
        'info': 'fas fa-info-circle text-primary'
    };

    $('#toastIcon').attr('class', iconClasses[type] + ' me-2');
    $('#toastMessage').text(message);

    // Show toast
    const toast = new bootstrap.Toast($('#toast')[0]);
    toast.show();
}

// Generate Portfolio Website
function generatePortfolio() {
    const data = currentStudentData;
    const personalInfo = data.personalInfo;

    const portfolioHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${personalInfo.name} - Portfolio</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Poppins', sans-serif; }
                .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; }
                .section-padding { padding: 80px 0; }
                .skill-badge { background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; margin: 5px; display: inline-block; }
                .project-card { transition: transform 0.3s ease; }
                .project-card:hover { transform: translateY(-10px); }
            </style>
        </head>
        <body>
            <!-- Navigation -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div class="container">
                    <a class="navbar-brand" href="#home">${personalInfo.name}</a>
                    <div class="navbar-nav ms-auto">
                        <a class="nav-link" href="#about">About</a>
                        <a class="nav-link" href="#skills">Skills</a>
                        <a class="nav-link" href="#projects">Projects</a>
                        <a class="nav-link" href="#contact">Contact</a>
                    </div>
                </div>
            </nav>

            <!-- Hero Section -->
            <section id="home" class="hero">
                <div class="container text-center">
                    <img src="${personalInfo.profileImage}" alt="${personalInfo.name}" class="rounded-circle mb-4" style="width: 150px; height: 150px; object-fit: cover; border: 5px solid white;">
                    <h1 class="display-4 fw-bold mb-3">${personalInfo.name}</h1>
                    <p class="lead mb-4">${data.education[0]?.degree || 'Student'}</p>
                    <p class="mb-4">${data.objective}</p>
                    <div class="d-flex justify-content-center gap-3">
                        ${personalInfo.github ? `<a href="https://${personalInfo.github}" class="btn btn-outline-light"><i class="fab fa-github"></i> GitHub</a>` : ''}
                        ${personalInfo.linkedin ? `<a href="https://${personalInfo.linkedin}" class="btn btn-outline-light"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                        <a href="mailto:${personalInfo.email}" class="btn btn-light"><i class="fas fa-envelope"></i> Contact Me</a>
                    </div>
                </div>
            </section>

            <!-- Skills Section -->
            <section id="skills" class="section-padding bg-light">
                <div class="container">
                    <h2 class="text-center mb-5">Technical Skills</h2>
                    ${Object.entries(data.skills).map(([category, skills]) => `
                        <div class="mb-4">
                            <h5 class="mb-3">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                            <div>
                                ${skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Projects Section -->
            ${data.projects && data.projects.length > 0 ? `
            <section id="projects" class="section-padding">
                <div class="container">
                    <h2 class="text-center mb-5">Featured Projects</h2>
                    <div class="row">
                        ${data.projects.slice(0, 6).map(project => `
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card project-card h-100">
                                    <div class="card-body">
                                        <h5 class="card-title">${project.title}</h5>
                                        <p class="card-text">${project.description}</p>
                                        <p class="text-muted small">${project.technologies.join(', ')}</p>
                                        <div class="mt-auto">
                                            ${project.github ? `<a href="${project.github}" class="btn btn-outline-primary btn-sm me-2"><i class="fab fa-github"></i> Code</a>` : ''}
                                            ${project.demo ? `<a href="${project.demo}" class="btn btn-primary btn-sm"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            ` : ''}

            <!-- Contact Section -->
            <section id="contact" class="section-padding bg-dark text-white">
                <div class="container text-center">
                    <h2 class="mb-5">Get In Touch</h2>
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <i class="fas fa-envelope fa-2x mb-3"></i>
                                    <p>${personalInfo.email}</p>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <i class="fas fa-phone fa-2x mb-3"></i>
                                    <p>${personalInfo.phone}</p>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <i class="fas fa-map-marker-alt fa-2x mb-3"></i>
                                    <p>${personalInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;

    // Download portfolio
    const blob = new Blob([portfolioHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${personalInfo.name.replace(/\s+/g, '_')}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Portfolio website generated and downloaded!', 'success');
}

// Add portfolio button functionality
$(document).ready(function () {
    // Add portfolio button after the existing buttons
    $('.d-grid.gap-2').append(`
        <button class="btn btn-outline-info" onclick="generatePortfolio()">
            <i class="fas fa-globe me-2"></i>Generate Portfolio
        </button>
    `);
});

// Template selection functionality
function selectTemplate(templateName) {
    currentTemplate = templateName;

    // Update UI selection
    document.querySelectorAll('.template-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-template="${templateName}"]`).classList.add('selected');

    // Update resume preview
    updateResume();

    // Show success toast
    showToast('Template updated successfully!');
}

// Update resume based on current settings
function updateResume() {
    generateResume();
}

// Apply custom objective
function applyCustomObjective() {
    const customText = document.getElementById('customObjective').value.trim();
    if (customText) {
        if (currentStudentData) {
            currentStudentData.personalInfo.objective = customText;
        }
        generateResume();
        $('#objectiveModal').modal('hide');
        showToast('Objective updated successfully!');
    }
}

// Use objective template
function useObjectiveTemplate(element) {
    const text = element.textContent.split(': ')[1].replace(/"/g, '');
    document.getElementById('customObjective').value = text;
}

// Print resume functionality
function printResume() {
    const printContent = document.getElementById('resumePreview').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
        <div style="padding: 20px;">
            ${printContent}
        </div>
    `;

    window.print();
    document.body.innerHTML = originalContent;

    // Reinitialize after print
    generateResume();
}

// Save resume template
function saveResume() {
    try {
        const resumeData = {
            template: currentTemplate,
            studentData: currentStudentData,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('savedResume', JSON.stringify(resumeData));
        showToast('Resume template saved successfully!');
    } catch (error) {
        console.error('Error saving resume:', error);
        showToast('Error saving resume. Please try again.', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    if (!toast) return;

    const toastBody = document.getElementById('toastMessage');
    const toastHeader = toast.querySelector('.toast-header');

    toastBody.textContent = message;

    // Update toast styling based on type
    toastHeader.className = `toast-header bg-${type === 'error' ? 'danger' : 'success'} text-white`;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}