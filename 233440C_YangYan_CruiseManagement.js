const readline = require("readline");
const db = require("./services/dbservices.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

const menu = `
                       $o
                       $                     .........
                      $$$      .oo..     'oooo'oooo'ooooooooo....
                       $       $$$$$$$
                   .ooooooo.   $$!!!!!
                 .'.........'. $$!!!!!      o$$oo.   ...oo,oooo,oooo'ooo''
    $          .o'  oooooo   '.$$!!!!!      $$!!!!!       'oo''oooo''
 ..o$ooo...    $                '!!''!.     $$!!!!!
 $    ..  '''oo$$$$$$$$$$$$$.    '    'oo.  $$!!!!!
 !.......      '''..$$ $$ $$$   ..        '.$$!!''!
 !!$$$!!!!!!!!oooo......   '''  $$ $$ :o           'oo.
 !!$$$!!!$$!$$!!!!!!!!!!oo.....     ' ''  o$$o .      ''oo..
 !!!$$!!!!!!!!!!!!!!!!!!!!!!!!!!!!ooooo..      'o  oo..    $
  '!!$$!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!oooooo..  ''   ,$
   '!!$!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!oooo..$$
    !!$!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!$'
    '$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$!!!!!!!!!!!!!!!!!!,
.....$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$.....
=========================================================================
                         Cruise Management App
=========================================================================
1. Connect to MongoDB
2. Add a Cruise
3. Add a Customer
4. Book a Cruise
5. List Cruises
6. List Customers
7. List Bookings
8. Update Cruise Status
9. Update Customer Status
10. Update Booking Status
11. Exit
=========================================================================
`;

async function handleOption(option) {
  switch (+option) {
    case 1:
      await connect();
      break;
    case 2:
      await AddCruise();
      break;
    case 3:
      await AddCustomer();
      break;
    case 4:
      await AddBooking();
      break;
    case 5:
      await ListCruises();
      break;
    case 6:
      await ListCustomers();
      break;
    case 7:
      await ListBookings();
      break;
    case 8:
      await UpdateCruises();
      break;
    case 9:
      await UpdateCustomers();
      break;
    case 10:
      await UpdateBookings();
      break;
    case 11:
      rl.close();
      return;
    default:
      console.log("Invalid option.");
  }

  setTimeout(() => {
    rl.question(menu, handleOption);
  }, 1500);
}

rl.question(menu, handleOption);

rl.on("close", () => {
  console.log("\nCruise Management App is shutting down.");
  process.exit(0);
});

async function connect() {
  try {
    const msg = await db.connect();
    console.log(msg);
  } catch (err) {
    console.log(err.message);
  }
}

async function AddCruise() { //ADD CRUISE =====
  try {
    const name = await ask("Cruise name: ");
    const shipType = await ask("Ship type: ");
    const priceStr = await ask("Price: ");
    const price = Number(priceStr);

    const departurePort = await ask("Departure port: ");
    const arrivalPort = await ask("Arrival port: ");

    const depDate = await ask("Departure date (YYYY-MM-DD): ");
    const arrDate = await ask("Arrival date (YYYY-MM-DD): ");
    const checkInTime = await ask("Check-in time (HH:MM): ");
    const checkOutTime = await ask("Check-out time (HH:MM): ");

    const cruise = await db.addCruise(
      name,
      shipType,
      price,
      departurePort,
      arrivalPort,
      depDate,
      arrDate,
      checkInTime,
      checkOutTime
    );

    console.log("\nCruise added successfully:");
    console.log("======================================");
    console.log(`ID:              ${cruise._id}`);
    console.log(`Name:            ${cruise.name}`);
    console.log(`Ship Type:       ${cruise.shipType}`);
    console.log(`Price:           ${cruise.price}`);
    console.log(`Route:           ${cruise.departurePort} to ${cruise.arrivalPort}`);
    console.log(`Departure date:  ${cruise.schedule.departureDate}`);
    console.log(`Arrival date:    ${cruise.schedule.arrivalDate}`);
    console.log(`Check-in time:   ${cruise.schedule.checkInTime}`);
    console.log(`Check-out time:  ${cruise.schedule.checkOutTime}`);
    console.log(`Status:          ${cruise.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error adding cruise:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function AddCustomer() { //ADD CUSTOMER =====
  try {
    const customerId = await ask("Customer ID (e.g. C001): ");
    const firstName = await ask("First name: ");
    const lastName = await ask("Last name: ");
    const email = await ask("Email: ");
    const phone = await ask("Phone: ");
    const nationality = await ask("Nationality: ");

    const emergencyName = await ask("Emergency contact name: ");
    const emergencyPhone = await ask("Emergency contact phone: ");

    const customer = await db.addCustomer(
      customerId,
      firstName,
      lastName,
      email,
      phone,
      nationality,
      emergencyName,
      emergencyPhone
    );

    console.log("\nCustomer added successfully:");
    console.log("======================================");
    console.log(`ID:                ${customer._id}`);
    console.log(`Customer ID:       ${customer.customerId}`);
    console.log(`Name:              ${customer.firstName} ${customer.lastName}`);
    console.log(`Email:             ${customer.email}`);
    console.log(`Phone:             ${customer.phone}`);
    console.log(`Nationality:       ${customer.nationality}`);
    console.log(`Emergency contact: ${customer.emergencyContact.name} (${customer.emergencyContact.phone})`);
    console.log(`Status:            ${customer.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error adding customer:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function AddBooking() { //ADD BOOKING =====
  try {
    const cruises = await db.listCruises(); //get cruises

    if (cruises.length === 0) { //check is there are cruises
      console.log("No cruises are available.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nAvailable cruises:"); //show cruises
    cruises.forEach((c, index) => {
      console.log(
        `${index + 1}. ${c.name} | Ship: ${c.shipType} | Price: ${c.price} | ${c.departurePort} to ${c.arrivalPort}`
      );
      console.log(`   Departure date: ${c.schedule.departureDate}`);
      console.log(`   Arrival date:   ${c.schedule.arrivalDate}`);
      console.log("--------------------------------------");
    });

    const choiceStr = await ask(`Select a cruise (1-${cruises.length}): `);
    const choice = parseInt(choiceStr, 10);

    if (isNaN(choice) || choice < 1 || choice > cruises.length) { //validate options
      console.log("Invalid choice. Booking cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const selectedCruise = cruises[choice - 1];

    const customerId = await ask("Enter customer ID (e.g. C001): "); //get customerId 
    const { booking, customer } = await db.AddBooking(selectedCruise._id, customerId); //fetch the whole document of customer

    console.log("\nBooking created successfully:");
    console.log("======================================");
    console.log(`Booking ID:   ${booking._id}`);
    console.log(`Customer ID:  ${booking.customerId}`);
    console.log(`Name:         ${customer.firstName} ${customer.lastName}`);
    console.log(`Email:        ${customer.email}`);
    console.log(`Cruise ID:    ${booking.cruise}`);
    console.log(`Ship Type:    ${selectedCruise.shipType}`);
    console.log(`Route:        ${selectedCruise.departurePort} to ${selectedCruise.arrivalPort}`);
    console.log(`Departure:    ${selectedCruise.schedule.departureDate}`);
    console.log(`Arrival:      ${selectedCruise.schedule.arrivalDate}`);
    console.log(`Price:        ${selectedCruise.price}`);
    console.log(`Status:       ${booking.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error creating booking:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function ListCruises() { //LIST CRUISES =====
  try {
    const cruises = await db.listCruises(); //get cruises

    if (cruises.length === 0) {
      console.log("\nNo cruises found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nAll cruises:");
    console.log("======================================");
    cruises.forEach((c) => {
      console.log(`ID:        ${c._id}`);
      console.log(`Name:      ${c.name}`);
      console.log(`Ship Type: ${c.shipType}`);
      console.log(`Price:     ${c.price}`);
      console.log(`Route:     ${c.departurePort} to ${c.arrivalPort}`);
      console.log(`Departure: ${c.schedule.departureDate}`);
      console.log(`Arrival:   ${c.schedule.arrivalDate}`);
      console.log(`Status:    ${c.status}`);
      console.log("--------------------------------------");
    });
    console.log("======================================\n");
  } catch (err) {
    console.log("Error listing cruises:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function ListCustomers() { //LIST CUSTOMERS =====
  try {
    const customers = await db.listCustomers();

    if (customers.length === 0) {
      console.log("\nNo customers found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nAll customers:");
    console.log("======================================");
    customers.forEach((c) => {
      console.log(`ID:          ${c._id}`);
      console.log(`Customer ID: ${c.customerId}`);
      console.log(`Name:        ${c.firstName} ${c.lastName}`);
      console.log(`Email:       ${c.email}`);
      console.log(`Phone:       ${c.phone}`);
      console.log(`Nationality: ${c.nationality}`);
      console.log(`Status:      ${c.status}`);
      console.log("--------------------------------------");
    });
    console.log("======================================\n");
  } catch (err) {
    console.log("Error listing customers:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function ListBookings() { //LIST BOOKINGS =====
  try {
    const bookings = await db.listBookings();

    if (bookings.length === 0) {
      console.log("\nNo bookings found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nAll bookings:");
    console.log("======================================");
    bookings.forEach((b) => {
      console.log(`Booking ID:  ${b._id}`);
      console.log(`Customer ID: ${b.customerId}`);
      if (b.customer) {
        console.log(
          `Customer:    ${b.customer.firstName} ${b.customer.lastName}`
        );
      }
      if (b.cruise) {
        console.log(`Cruise:      ${b.cruise.name}`);
        console.log(
          `Route:       ${b.cruise.departurePort} to ${b.cruise.arrivalPort}`
        );
        console.log(`Price:       ${b.cruise.price}`);
      }
      console.log(`Status:      ${b.status}`);
      console.log("--------------------------------------");
    });
    console.log("======================================\n");
  } catch (err) {
    console.log("Error listing bookings:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function UpdateCruises() { //UPDATE CRUISE STATUS =====
  try {
    const cruises = await db.listCruises(); //get cruises

    if (cruises.length === 0) {
      console.log("\nNo cruises found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nSelect a cruise to update:");
    console.log("======================================");
    cruises.forEach((c, index) => {
      console.log(
        `${index + 1}. ${c.name} | ${c.departurePort} to ${c.arrivalPort} | Status: ${c.status}`
      );
    });
    console.log("======================================");

    const choiceStr = await ask(`Choose a cruise (1-${cruises.length}): `);
    const choice = parseInt(choiceStr, 10);

    if (isNaN(choice) || choice < 1 || choice > cruises.length) { //validation
      console.log("Invalid choice. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const selectedCruise = cruises[choice - 1];

    const statuses = ["active", "inactive", "completed", "cancelled"];
    console.log("\nSelect new status:");
    statuses.forEach((s, index) => {
      console.log(`${index + 1}. ${s}`);
    });

    const statusStr = await ask(`Choose status (1-${statuses.length}): `); //get status
    const statusChoice = parseInt(statusStr, 10);

    if (isNaN(statusChoice) || statusChoice < 1 || statusChoice > statuses.length) {
      console.log("Invalid option. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const newStatus = statuses[statusChoice - 1];
    const updatedCruise = await db.updateCruiseStatus(selectedCruise._id, newStatus);

    console.log("\nCruise status updated successfully:");
    console.log("======================================");
    console.log(`ID:        ${updatedCruise._id}`);
    console.log(`Name:      ${updatedCruise.name}`);
    console.log(`Route:     ${updatedCruise.departurePort} to ${updatedCruise.arrivalPort}`);
    console.log(`Status:    ${updatedCruise.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error updating cruise status:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function UpdateCustomers() { // UPDATE CUSTOMER STATUS =====
  try {
    const customers = await db.listCustomers();

    if (customers.length === 0) {
      console.log("\nNo customers found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nSelect a customer to update:");
    console.log("======================================");
    customers.forEach((c, index) => {
      console.log(
        `${index + 1}. ${c.customerId} | ${c.firstName} ${c.lastName} | Status: ${c.status}`
      );
    });
    console.log("======================================");

    const choiceStr = await ask(`Choose a customer (1-${customers.length}): `);
    const choice = parseInt(choiceStr, 10);

    if (isNaN(choice) || choice < 1 || choice > customers.length) {
      console.log("Invalid option. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const selectedCustomer = customers[choice - 1];

    const statuses = ["active", "inactive"];
    console.log("\nSelect new status:");
    statuses.forEach((s, index) => {
      console.log(`${index + 1}. ${s}`);
    });

    const statusStr = await ask(`Choose status (1-${statuses.length}): `);
    const statusChoice = parseInt(statusStr, 10);

    if (isNaN(statusChoice) || statusChoice < 1 || statusChoice > statuses.length) {
      console.log("Invalid status. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const newStatus = statuses[statusChoice - 1];
    const updatedCustomer = await db.updateCustomerStatus(selectedCustomer._id, newStatus);

    console.log("\nCustomer status updated successfully:");
    console.log("======================================");
    console.log(`ID:          ${updatedCustomer._id}`);
    console.log(`Customer ID: ${updatedCustomer.customerId}`);
    console.log(`Name:        ${updatedCustomer.firstName} ${updatedCustomer.lastName}`);
    console.log(`Status:      ${updatedCustomer.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error updating customer status:", err.message);
  }

  await ask("Press Enter to return to menu...");
}

async function UpdateBookings() { // UPDATE BOOKING STATUS =====
  try {
    const bookings = await db.listBookings(); //retrieve all bookings

    if (bookings.length === 0) {
      console.log("\nNo bookings found.");
      await ask("Press Enter to return to menu...");
      return;
    }

    console.log("\nSelect a booking to update:"); //display nice list for user
    console.log("======================================");
    bookings.forEach((b, index) => {
      const customerName = b.customer
        ? `${b.customer.firstName} ${b.customer.lastName}` //if else
        : "Unknown customer";
      const cruiseName = b.cruise ? b.cruise.name : "Unknown cruise";

      console.log(
        `${index + 1}. Booking ID: ${b._id} | ${customerName} | ${cruiseName} | Status: ${b.status}`
      );
    });
    console.log("======================================");

    const choiceStr = await ask(`Choose a booking (1-${bookings.length}): `);
    const choice = parseInt(choiceStr, 10);

    if (isNaN(choice) || choice < 1 || choice > bookings.length) {
      console.log("Invalid option. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const selectedBooking = bookings[choice - 1];

    const statuses = ["pending", "confirmed", "checked-in", "completed", "cancelled"]; //status types
    console.log("\nSelect new status:");
    statuses.forEach((s, index) => {
      console.log(`${index + 1}. ${s}`);
    });

    const statusStr = await ask(`Choose status (1-${statuses.length}): `);
    const statusChoice = parseInt(statusStr, 10);

    if (isNaN(statusChoice) || statusChoice < 1 || statusChoice > statuses.length) {
      console.log("Invalid status. Update cancelled.");
      await ask("Press Enter to return to menu...");
      return;
    }

    const newStatus = statuses[statusChoice - 1];
    const updatedBooking = await db.updateBookingStatus(selectedBooking._id, newStatus); //update

    const customerName = updatedBooking.customer
      ? `${updatedBooking.customer.firstName} ${updatedBooking.customer.lastName}`
      : selectedBooking.customer && selectedBooking.customer.firstName;

    console.log("\nBooking status updated successfully:");
    console.log("======================================");
    console.log(`Booking ID: ${updatedBooking._id}`);
    console.log(`Customer:   ${customerName}`);
    console.log(`Status:     ${updatedBooking.status}`);
    console.log("======================================\n");
  } catch (err) {
    console.log("Error updating booking status:", err.message);
  }

  await ask("Press Enter to return to menu...");
}
