(function (DOM, doc) {
  'use strict';  

  function app(){
    var $marcaInput = new DOM('[data-js="marca-input"]');
    var $anoInput = new DOM('[data-js="ano-input"]');
    var $placaInput = new DOM('[data-js="placa-input"]');
    var $corInput = new DOM('[data-js="cor-input"]');
    var $imagemInput = new DOM('[data-js="imagem-input"]');    
    let $carTable = new DOM('[data-js="car-table"]');
    var $nomeEmpresa = new DOM('[data-js="nome-empresa"]');
    var $telefoneEmpresa = new DOM('[data-js="telefone-empresa"]');    
    var $form = new DOM('form');  

    var $flag = false;
    
    var $body = new DOM('body');
    

    $form.on('submit', handleCreateCar);
      
    (function handleNameAndPhone(){     
      var ajax = new XMLHttpRequest();         
      ajax.open('GET', `company.json`);
      ajax.send();

      ajax.addEventListener('readystatechange', () => {
        if(ajax.readyState === 4 && ajax.status === 200) {
          const data = JSON.parse(ajax.responseText); 
          
          $nomeEmpresa.get()[0].textContent = data.name;
          $telefoneEmpresa.get()[0].textContent = data.phone;
        }
      });          

      console.log(ajax.responseText);
    })();
    
    (getCars)();

    function increment(){ 
      var counter = -1;

      counter++;

      return counter;
    }    

    function cleanCarFields() {
      $marcaInput.get()[0].value = "";
      $anoInput.get()[0].value = "";
      $placaInput.get()[0].value = "";
      $corInput.get()[0].value = "";
      $imagemInput.get()[0].value = "";
    }
  
    async function handleCreateCar(e) {
      e.preventDefault();

      var car = {
        marca: $marcaInput.get()[0].value,
        ano: $anoInput.get()[0].value,
        placa: $placaInput.get()[0].value,
        cor: $corInput.get()[0].value,
        imagem: $imagemInput.get()[0].value
      };          

      cleanCarFields();      
      createCar(car);    

      await new Promise(r => setTimeout(r, 100));
      
      getCars();
    }
    function tableRemover(){
      $carTable.get()[0].removeChild($carTable.get()[0].lastElementChild);
      var $tbody = doc.createElement('tbody');
      $carTable.get()[0].appendChild($tbody);
    }

    function getCars() {      
      tableRemover();
      var ajax = new XMLHttpRequest();
      var cars;            

      ajax.open('GET', 'http://localhost:3333/cars');
      ajax.send();

      ajax.addEventListener('readystatechange', () => {
        if(ajax.readyState === 4 && ajax.status === 200) {
          cars = JSON.parse(ajax.responseText);
          
          console.log(cars);
          
          cars.forEach(function(car) {
            createCarList(car);
          });
        }
      });            

      return cars;
    }
  

    function createCar(car) {
      var ajax = new XMLHttpRequest();
      ajax.open('POST', 'http://localhost:3333/cars');
      ajax.setRequestHeader("Content-Type", "application/json;charset=UTF-8", false);      

      ajax.send(JSON.stringify(car));            

      ajax.onreadystatechange = function (e) {
        e.preventDefault();

        if(ajax.readyState === 4 && ajax.status === 200) {
          console.log("Carro criado");
        }
      }      
    }

    function createCarList(car) {                   
      var $fragment = doc.createDocumentFragment();               

      var $tr = doc.createElement('tr');     
      
      var $tdMarca = doc.createElement('td');
      var $tdAno = doc.createElement('td');
      var $tdPlaca = doc.createElement('td');
      var $tdCor = doc.createElement('td');
      var $tdImg = doc.createElement('td');
      var $deleteImg = doc.createElement('td');              
                                
      $tdMarca.appendChild(doc.createTextNode(car['marca']));      
      $tdAno.appendChild(doc.createTextNode(car['ano']));      
      $tdPlaca.appendChild(doc.createTextNode(car['placa']));      
      $tdCor.appendChild(doc.createTextNode(car['cor']));

      var $img = doc.createElement('img');
      $img.src = car['imagem']; 
      $tdImg.appendChild($img);
      
      var $dumpImg = doc.createElement('img');
      $dumpImg.src = './assets/lixeira.png';
      $dumpImg.style.width = "40px";
      $dumpImg.style.height = "40px";

      $deleteImg.appendChild($dumpImg);


      $tr.appendChild($tdMarca);
      $tr.appendChild($tdAno);
      $tr.appendChild($tdPlaca);
      $tr.appendChild($tdCor);              
      $tr.appendChild($tdImg);   
      $tr.appendChild($deleteImg); 
                                          
      $deleteImg.onclick = function(event) {
        event.preventDefault();

        var $child = $deleteImg.parentNode;
  
        $carTable.get()[0].lastElementChild.removeChild($child);
      }      
      $fragment.appendChild($tr);
      $carTable.get()[0].lastElementChild.appendChild($fragment);      
    };            
  }

  app();
})(window.DOM, document);
