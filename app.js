const base_url =
  "http://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1";
const service_key =
  "F0ujwILUgFVtwYhJG8RKhlh0Zne1fV7drPAZN1CbFqshZ4o%2BfztKpNhGadkKL%2FKCGIaHfw8iPJ7K4%2FU8CgnDBg%3D%3D";

const url_with_service_key = `${base_url}?ServiceKey=${service_key}&type=json`;
const finder = document.querySelector("#finder");
const finderForm = document.querySelector("#finder_form");
const select = document.querySelector("#select");
const protein = document.querySelector("#protein");
const fat = document.querySelector("#fat");
const carbo = document.querySelector("#carbo");
const calories = document.querySelector("#calories");
const foodName = document.querySelector("#foodName");
const foodGram = document.querySelector("#foodGram");
const foodName_gram = document.querySelector("#foodName_gram");
const selectForm = document.querySelector("#selectForm");
async function query_by_food_name(food_name) {
  const url_with_food_name = `${url_with_service_key}&desc_kor=${food_name}`;
  let result_json = await fetch(url_with_food_name)
    .then((res) => res.json())
    .then((json) => json.body);

  return result_json;
}

function foodFinder(event) {
  event.preventDefault();
  const savedFood = finder.value;
  query_by_food_name(savedFood).then((data) => {
    if (data) {
      console.log("Food Data:", data);
      if (data.items && data.items.length > 0) {
        console.log(data.items);
        select.innerHTML = "";
        data.items.map((item) => {
          const itemOption = document.createElement("option");
          select.append(itemOption);
          itemOption.innerText = item.DESC_KOR;
          itemOption.value = JSON.stringify([
            item.DESC_KOR,
            item.NUTR_CONT1,
            item.NUTR_CONT2,
            item.NUTR_CONT3,
            item.NUTR_CONT4,
          ]);
        });
      } else {
        foodName.innerText = "Sorry, No items found";
      }
    } else {
      console.log("No data received");
    }
  });
  console.log(savedFood);
}

finderForm.addEventListener("submit", foodFinder);

function drawInfo(event, setGram) {
  event.preventDefault();
  const infoValue = select.value;
  const getGram = parseFloat(foodGram.value) / 100;
  const parsedValue = JSON.parse(infoValue);
  console.log(parseFloat(parsedValue[1]) * setGram);
  foodName.innerText = parsedValue[0];
  foodName_gram.innerText = `(${getGram * 100}g)`;
  calories.innerText = `칼로리: ${(
    parseFloat(parsedValue[1]) * getGram
  ).toFixed(2)} cal`;
  carbo.innerText = `탄수화물: ${(parseFloat(parsedValue[2]) * getGram).toFixed(
    2
  )} g`;
  protein.innerText = `단백질: ${(parseFloat(parsedValue[3]) * getGram).toFixed(
    2
  )} g`;
  fat.innerText = `지방 ${parseFloat(parsedValue[4]).toFixed(2) * getGram} g`;
}

selectForm.addEventListener("submit", drawInfo);
