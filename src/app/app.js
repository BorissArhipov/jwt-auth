let form1 = document.querySelector('#form1');
let form2 = document.querySelector('#form2');

form1.addEventListener('submit', async e => {
    e.preventDefault();
    let name = e.target.name1.value;
    let pass = e.target.pass1.value;
    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, pass: pass})
    }).then(res => {
        if(res.status === 201) {
            console.log('User created');
        } else {
            console.log('Error');
        }
    }).catch(err => {
        console.log(err)
    });
});

form2.addEventListener('submit', async e => {
    e.preventDefault();
    let name = e.target.name2.value;
    let pass = e.target.pass2.value;
    await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, pass: pass})
    }).then(res => {
        if(res.status !== 500 && res.status !== 400) {
                res.json().then( async res => {
                    if(res === "Not Allowed") {
                        console.log(res);
                        return;
                    } else {
                        await fetch('http://localhost:3000/posts', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${res.accessToken}`
                            }     
                        }).then(res => {
                            res.json().then(res => {
                                console.log(res);
                            })
                        }).catch(err => console.log(err));
                    }
                });
        } else {
            console.log(res);
        }
    }).catch(err => {
        console.log(err)
    });
});