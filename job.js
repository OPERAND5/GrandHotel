const jobData = {
    manager: {
        title: "Hotel Manager",
        description: "Responsible for overseeing all hotel operations, staff management, and ensuring guest satisfaction at the highest level.",
        req: ["5+ years of experience in luxury hospitality", "Degree in Hospitality Management or related field", "Strong leadership and problem-solving skills", "Proficiency in hotel management software"]
    },
    admin: {
        title: "Admin Officer",
        description: "Maintains office efficiency by planning and implementing office systems, layouts, and equipment procurement.",
        req: ["Bachelor's degree in Business Administration", "Experience with record-keeping and data entry", "Excellent organizational and communication skills", "Proficiency in MS Office Suite"]
    },
    keeper: {
        title: "Hotel Keeper",
        description: "Ensures that all hotel rooms and common areas are maintained to the highest standards of cleanliness and comfort.",
        req: ["Previous experience in housekeeping or facility maintenance", "Strong attention to detail", "Ability to handle cleaning equipment and chemicals safely", "Reliable and punctual"]
    },
    gateman: {
        title: "Gateman",
        description: "Responsible for maintaining security at the hotel entrance, monitoring visitors, and ensuring the safety of guests and staff.",
        req: ["Basic security training or certification", "Physically fit and alert", "Good communication skills", "Ability to work in shifts"]
    },
    cleaner: {
        title: "Cleaner",
        description: "Provides daily cleaning services to ensure a hygienic and welcoming environment for all guests.",
        req: ["Prior experience in cleaning services", "Knowledge of health and safety standards", "Ability to follow detailed cleaning schedules", "Positive attitude"]
    }
};

function showJob(role) {
    const job = jobData[role];
    if (!job) return;

    // Set content
    document.getElementById('jobTitle').textContent = job.title;
    document.getElementById('jobDescription').textContent = job.description;

    // Build the requirements list dynamically
    const reqList = document.getElementById('jobRequirements');
    reqList.innerHTML = ''; // Clear previous
    const ul = document.createElement('ul');
    job.req.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    reqList.appendChild(ul);

    // Reveal the section
    const details = document.getElementById('jobDetails');
    details.classList.remove('hidden');
    
    // Scroll to the application form
    details.scrollIntoView({ behavior: 'smooth' });
}

// Handle form submission with a professional response
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would typically send data to a server
    this.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>Application Received!</h3>
            <p>Thank you for your interest in joining The Grand Hotel. Our team will review your CV and get back to you shortly.</p>
        </div>
    `;
});