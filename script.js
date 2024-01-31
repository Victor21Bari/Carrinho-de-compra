const c = (el) => document.querySelector(el);
const ca = (el) => document.querySelectorAll(el);
let modalQt = 1;
let cart = [];
let modalKey = 0;
//listagens das pizzas
pizzaJson.forEach((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    //preencher as iinformacoes em pizzaItem
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;


        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        ca('.pizzaInfo--size').forEach((size, sizeIndex) => {
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    c('.pizza-area').append(pizzaItem);
});

//eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
})
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    c('.pizzaInfo--qt').innerHTML = modalQt;
})

ca('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    //qual a pizza 
    console.log('add ' + modalKey)
    // tamanho 
    let size = c('.pizzaInfo--size.selected').getAttribute('data-key');
    console.log('Tamanho da pizza: ' + size);
    // quantas  pizzas
    console.log('Quantidade: ' + modalQt);

    // se a pizza for a mesma, porem de tamanhos diferentes
    let identfier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex((item) => {
        return item.identfier == identfier
    });

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identfier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }

    //adicionar ao carrinho de fato 
    updateCart()
    closeModal();
});

//atualizar carrrinho 
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        c('aside').style.left = 0;
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if (cart.length > 0) {
        c('aside').classList.add('show');
        let subtotal = 0;
        let total = 0;
        let desconto = 0;
        c('.cart').innerHTML = '';


        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => {
                return item.id == cart[i].id;
            });

            subtotal += pizzaItem.price * cart[i].qt;

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let cardItem = c('.models .cart--item').cloneNode(true);
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            cardItem.querySelector('img').src = pizzaItem.img;
            cardItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cardItem.querySelector(('.cart--item--qt')).innerHTML = cart[i].qt;
            cardItem.querySelector(('.cart--item-qtmenos')).addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cardItem.querySelector(('.cart--item-qtmais')).addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cardItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}