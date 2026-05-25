import 'cally';
import { addDays, differenceInWeeks, format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MAX_WEEK_SIZE = 52;

const form = document.getElementById('dashboard-form');
const btnInfo = document.getElementById('btn-info');
const infoModal = document.getElementById('info-modal');
const btnSubmit = document.getElementById('btn-submit');
const dateError = document.getElementById('date-error');
const startDateBtn = document.getElementById('startDateBtn');
const endDateBtn = document.getElementById('endDateBtn');
const startDatePicker = document.getElementById('startDate');
const endDatePicker = document.getElementById('endDate');
const floorInput = document.getElementById('floor');

btnInfo.addEventListener('click', () => {
  infoModal.showModal();
});

function formatDateDisplay(isoValue) {
  return isoValue ? format(new Date(isoValue), 'dd.MM.yyyy') : '';
}

function closeDropdown(element) {
  element.closest('.dropdown').blur();
  document.activeElement.blur();
}

startDatePicker.addEventListener('change', () => {
  startDateBtn.textContent = formatDateDisplay(startDatePicker.value);
  closeDropdown(startDatePicker);
  validateForm();
});

endDatePicker.addEventListener('change', () => {
  endDateBtn.textContent = formatDateDisplay(endDatePicker.value);
  closeDropdown(endDatePicker);
  validateForm();
});

function validateForm() {
  const startDate = startDatePicker.value ? new Date(startDatePicker.value) : null;
  const endDate = endDatePicker.value ? new Date(endDatePicker.value) : null;
  const floor = floorInput.value.trim();

  let valid = true;

  if (!floor || !startDate || !endDate) {
    valid = false;
  }

  if (startDate && endDate && differenceInWeeks(endDate, startDate) > MAX_WEEK_SIZE) {
    dateError.classList.remove('hidden');
    valid = false;
  } else {
    dateError.classList.add('hidden');
  }

  btnSubmit.disabled = !valid;
}

form.addEventListener('input', validateForm);
validateForm();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tenantLeft = document.getElementById('tenantLeft').value.trim();
  const tenantMiddle = document.getElementById('tenantMiddle').value.trim();
  const tenantRight = document.getElementById('tenantRight').value.trim();
  const floor = floorInput.value.trim();
  const startDate = new Date(startDatePicker.value);
  const endDate = new Date(endDatePicker.value);

  const tenants = [tenantLeft, tenantMiddle, tenantRight].filter(Boolean);
  const rows = defineRows(tenants, startDate, endDate);
  generatePDF(rows, floor);
});

function defineRows(tenants, startDate, endDate) {
  let emptyRow = false;
  let weekStartDate = startDate;
  let weekEndDate = addDays(weekStartDate, 6);
  const rows = [];

  let index = 0;
  while (endDate > weekEndDate) {
    const row = {
      week: `${format(weekStartDate, 'dd.MM.yyyy')} - ${format(weekEndDate, 'dd.MM.yyyy')}`,
      tenant: emptyRow ? '' : tenants[index],
      completed: '',
    };
    rows.push(row);

    if (!emptyRow) {
      index = index < tenants.length - 1 ? index + 1 : 0;
    }
    emptyRow = !emptyRow;
    weekStartDate = addDays(weekEndDate, 1);
    weekEndDate = addDays(weekStartDate, 6);
  }
  return rows;
}

function generatePDF(rows, floor) {
  const doc = new jsPDF();

  const floorLabel = floor === '0' ? 'EG' : `${floor}. OG`;
  const title = `Treppenreinigung ${floorLabel}`;
  doc.setFontSize(19);
  doc.setFont('Helvetica', 'normal', 'bold');
  doc.text(title, 10, 18);

  const img = new Image();
  img.src = '/treppenhaus.png';
  const pageSize = doc.internal.pageSize;
  doc.addImage(img, 'png', pageSize.getWidth() - 78, 5, 68, 25);

  autoTable(doc, {
    head: [{ week: 'Woche', tenant: 'Mietpartei', completed: 'Erledigt durch/am' }],
    body: rows,
    styles: { valign: 'middle', cellPadding: 0.4, fontSize: 10 },
    startY: 32,
    margin: { left: 10, right: 10, bottom: 5 },
    theme: 'grid',
  });

  doc.save('treppenreinigung-plan.pdf');
}
