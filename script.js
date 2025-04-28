let formData = {};
let currentStep = 1;
const totalSteps = 6;

function handleLoanResponse(hasLoan) {
    formData.hasChfLoan = hasLoan;
    
    // Update button styles
    const buttons = document.querySelectorAll('#step1 .button-group button');
    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');

    if (hasLoan) {
        // If they have a loan, proceed to next step
        showStep(2);
    } else {
        // If they don't have a loan, show the message
        document.getElementById('step1').style.display = 'none';
        document.getElementById('noLoanMessage').style.display = 'block';
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => {
        el.style.display = 'none';
    });

    // Show the requested step
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
        stepElement.style.display = 'block';
    }

    // Update progress bar
    updateProgress(step);
    currentStep = step;
}

function updateProgress(step) {
    const progress = document.getElementById('progress');
    const percentage = ((step - 1) / (totalSteps - 1)) * 100;
    progress.style.width = `${percentage}%`;
}

// Function to enable next button and handle button states
function enableNextButton(stepId) {
    const nextButton = document.querySelector(`#${stepId} .btn-next`);
    if (nextButton) {
        nextButton.removeAttribute('disabled');
        nextButton.classList.add('active');
    }
}

function disableNextButton(stepId) {
    const nextButton = document.querySelector(`#${stepId} .btn-next`);
    if (nextButton) {
        nextButton.setAttribute('disabled', 'disabled');
    }
}

// Function to handle form validation and navigation
function validateAndNavigate(stepId, data) {
    formData = { ...formData, ...data };
    enableNextButton(stepId);
}

// Handler for loan year and bank selection
function handleStep2Input() {
    const yearSelect = document.getElementById('loanYear');
    const bankSelect = document.getElementById('loanBank');
    
    validateStep2();
}

// Handler for legal action response
function handleLegalAction(response) {
    formData.legalAction = response;
    
    // Update button styles
    const buttons = document.querySelectorAll('#step3 .button-group button');
    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Automatically move to next step
    setTimeout(() => {
        showStep(4);
    }, 300);
}

// Handler for contract finished response
function handleContractFinished(response) {
    formData.contractFinished = response;
    
    // Update button styles
    const buttons = document.querySelectorAll('#step4 .button-group button');
    buttons.forEach(button => button.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Automatically move to next step
    setTimeout(() => {
        showStep(5);
    }, 300);
}

// Handler for loan duration input
function handleLoanDuration() {
    const duration = document.getElementById('loanDuration').value;
    if (duration && duration > 0 && duration <= 50) {
        validateAndNavigate('step5', { loanDuration: duration });
    }
}

// Next step function
function nextStep() {
    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// Function to populate year dropdown
function populateYearSelect() {
    const yearSelect = document.getElementById('loanYear');
    const startYear = 2000;
    const endYear = 2025;
    
    for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Function to handle currency selection
function handleCurrencySelection(currency) {
    // Store the selected currency
    formData.currency = currency;
    
    // Update button styles
    const buttons = document.querySelectorAll('.btn-currency');
    buttons.forEach(button => {
        button.classList.remove('selected');
        if (button.getAttribute('data-currency') === currency) {
            button.classList.add('selected');
        }
    });
    
    // Check if we can enable the next button
    validateStep2();
}

// Update the validation function to include currency selection
function validateStep2() {
    const yearSelect = document.getElementById('loanYear');
    const bankSelect = document.getElementById('loanBank');
    const currencySelected = formData.currency;
    
    if (yearSelect.value && bankSelect.value && currencySelected) {
        enableNextButton('step2');
    } else {
        disableNextButton('step2');
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    populateYearSelect();
    showStep(1);
    
    // Handle form submission
    document.getElementById('calculatorForm').addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('successMessage').style.display = 'block';
    });
    
    // Year and Bank selection listeners
    document.getElementById('loanYear').addEventListener('change', handleStep2Input);
    document.getElementById('loanBank').addEventListener('change', handleStep2Input);
    
    // Currency selection listener
    const currencyButtons = document.querySelectorAll('.btn-currency');
    currencyButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleCurrencySelection(this.getAttribute('data-currency'));
        });
    });
    
    // Loan duration listener
    document.getElementById('loanDuration').addEventListener('input', handleLoanDuration);
    
    // Contact form validation
    const contactForm = document.querySelector('#step6');
    const requiredInputs = contactForm.querySelectorAll('input[required]');
    const privacyConsent = document.getElementById('privacyConsent');
    
    function validateContactForm() {
        const allFilled = Array.from(requiredInputs).every(input => input.value.trim() !== '');
        const consentChecked = privacyConsent.checked;
        
        if (allFilled && consentChecked) {
            enableNextButton('step6');
        } else {
            disableNextButton('step6');
        }
    }
    
    requiredInputs.forEach(input => {
        input.addEventListener('input', validateContactForm);
    });
    privacyConsent.addEventListener('change', validateContactForm);
    
    // Update step 4 buttons to use proper handler
    const step4Buttons = document.querySelectorAll('#step4 .button-group button');
    step4Buttons.forEach(button => {
        button.onclick = function() {
            handleContractFinished(this.classList.contains('btn-primary'));
        };
    });
});
