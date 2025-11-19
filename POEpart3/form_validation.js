document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('enquiryForm');
  if(!form) return;

  function showError(msg){
    let err = document.getElementById('form-error-message');
    if(!err){ err = document.createElement('div'); err.id='form-error-message'; form.prepend(err); }
    err.style.color='red'; err.style.fontWeight='700'; err.style.padding='10px'; err.style.border='1px solid #f5c6cb'; err.style.borderRadius='8px';
    err.textContent = 'Error: ' + msg;
  }
  function clearError(){ const e=document.getElementById('form-error-message'); if(e) e.remove(); }

  form.addEventListener('submit', (e)=>{
    e.preventDefault(); clearError();
    if(!form.checkValidity()){ showError('Please check required fields.'); return; }

    const enquiryType = form.querySelector('#enquiry-type').value;
    const bookTitle = form.querySelector('#book').value.trim();
    if(enquiryType==='book' && bookTitle===''){ showError('Please add a book title for Book Availability enquiries.'); form.querySelector('#book').focus(); return; }

    
    const data = new FormData(form);
    fetch(form.action, { method: form.method || 'POST', body: data })
      .then(r=>{
        if(!r.ok) throw new Error('Server responded with ' + r.status);
        return r.text();
      })
      .then(text=>{
        
        alert('Enquiry submitted successfully. Thank you!');
        form.reset();
      })
      .catch(err=>{
        showError('Could not send form: ' + err.message);
      });
  });
});