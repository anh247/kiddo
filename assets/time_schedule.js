 document.addEventListener("DOMContentLoaded", function () {
      const monthElement = document.getElementById("month");
      const yearElement = document.getElementById("year");
      const calendarDays = document.getElementById("calendar-days");
      const prevBtn = document.querySelector(".prev-btn");
      const nextBtn = document.querySelector(".next-btn");

      const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
      ];

      let date = new Date();
      let currentMonth = date.getMonth();
      let currentYear = date.getFullYear();

      function populateCalendar(month, year) {
          calendarDays.innerHTML = ""; // Clear previous days
          monthElement.textContent = months[month];
          yearElement.textContent = year;

          let firstDay = new Date(year, month, 1).getDay();
          let daysInMonth = new Date(year, month + 1, 0).getDate();

          // Add previous month's last days if the first day is not Sunday
          for (let i = 0; i < firstDay; i++) {
              const emptyCell = document.createElement("span");
              calendarDays.appendChild(emptyCell);
          }

          // Add current month's days
          for (let i = 1; i <= daysInMonth; i++) {
              const dayCell = document.createElement("span");
              dayCell.textContent = i;
              dayCell.addEventListener("click", function () {
                  document.querySelectorAll(".calendar-days span").forEach(day => {
                      day.classList.remove("selected");
                  });
                  dayCell.classList.add("selected");
              });
              calendarDays.appendChild(dayCell);
          }
      }

      prevBtn.addEventListener("click", function () {
          currentMonth--;
          if (currentMonth < 0) {
              currentMonth = 11;
              currentYear--;
          }
          populateCalendar(currentMonth, currentYear);
      });

      nextBtn.addEventListener("click", function () {
          currentMonth++;
          if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
          }
          populateCalendar(currentMonth, currentYear);
      });

      populateCalendar(currentMonth, currentYear); // Initial calendar load
  });