const add_service_button = document.querySelector(".add_service_button");
const submit_button = document.querySelector(".submit_button");
add_service_button.addEventListener("click", (e) => {
  e.preventDefault();
  const insertPlace = document.querySelector(".inserted_data");
  const service_select = document.querySelector(".service_select");
  const quantity = document.querySelector("#quantity").value;
  const price = document.querySelector("#price").value;
  const val = service_select.value;
  const service = service_select.options[val].text;

  if (quantity <= 0 || service === "Dịch Vụ") {
    alert("Số lượng phải > 0 và Bạn Phải chọn dịch vụ cụ thể");
    return;
  }
  const html = `
  <input type="text"  id="city" value="${service}" class="formbold-form-input column-input input_service" readonly/>
  <input type="number"  id="city" value= ${quantity} class="formbold-form-input column-input input_quantity" readonly/>
  <input type="number"  id="city" value= ${
    price * quantity
  } class="formbold-form-input column-input input_price" readonly/>`;
  insertPlace.insertAdjacentHTML("afterbegin", html);
});

const getServiceIDByName = async (name) => {
  const request = new Request(
    `http://localhost:3022/get_services/?name=${name}`,
    {
      method: "GET",
    }
  );
  const res = await fetch(request);
  const id = await res.json();
  console.log(id);
  return id.service_id;
};

submit_button.addEventListener("click", async (e) => {
  e.preventDefault();
  const quantities = document.querySelectorAll(".input_quantity");
  const prices = document.querySelectorAll(".input_price");
  const services = document.querySelectorAll(".input_service");
  const supplier = document.querySelector("#supplier");
  const date = document.querySelector("#date");

  const items = [];
  let length = quantities.length;
  for (let i = 0; i < length; i++) {
    items.push({
      service_id: await getServiceIDByName(services[i].value),
      quantity: parseInt(quantities[i].value),
      price: parseFloat(prices[i].value),
    });
  }

  const data = `{
    "receipt_date" : "${date.value}",
    "supplier" : "${supplier.value}",
    "purchased_items": ${JSON.stringify(items)}
  }`;
  console.log(data);
  try {
    const request = new Request("http://localhost:3022/purchase-receipts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const res = await fetch(request);
    if (res.status === 200) alert("Tạo Hóa Đơn thành công");
  } catch (error) {
    alert("Xin Nhập đầy đủ thông tin");
  }
});
