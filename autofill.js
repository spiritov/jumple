function displayAutofill()
{
    setAutofillActive(true);     
    autofillElement.innerHTML = '';
        let autofillList = '';
        autofillTerms = matchToAutofill(inputElement.value);
        const ul = document.createElement('ul');
        autofillElement.appendChild(ul);

        for (let i = 0; i < autofillTerms.length; i++) {
            const li = document.createElement('li');
            li.id = 'li' + i;
            li.innerHTML = autofillTerms[i];
            ul.appendChild(li);
        }

        if (autofillTerms.length > 0) {
            setActiveAutofillElement(0);
            for (let i = 0; i < autofillTerms.length; i++) {
                document.getElementById('li' + i).addEventListener('mouseover', function () {
                    setActiveAutofillElement(i);
                });
                document.getElementById('li' + i).addEventListener('click', function () {
                    fillAutofillWithActiveTerm();

                });
            }
        }
}
function matchToAutofill()
{
    if(inputElement.value.length < 2) 
    {
        setAutofillActive(false);
        return [];
    }

    let reg = new RegExp(inputElement.value);

    autofillElement.classList.add('active');

    return autofillMapList.filter(function(term) {
        if(term.match(reg))
        {
            return term;
        }
    });
}

function setActiveAutofillElement(id)
{
    if(activeAutofillListElement.classList.contains('active')) //remove current if it exists
    {
        activeAutofillListElement.classList.remove('active');
    }
    activeAutofillListID = id;
    activeAutofillListElement = document.getElementById('li' + id);
    activeAutofillListElement.classList.add('active'); //add new
}

function fillAutofillWithActiveTerm()
{
    inputElement.value = activeAutofillListElement.innerHTML;
    setAutofillActive(false);
    inputElement.focus();
}

function setAutofillActive(bool)
{
    if(bool && !autofillElement.classList.contains('active'))
    {
        autofillElement.classList.add('active');
    }
    else if(!bool && autofillElement.classList.contains('active'))
    {
        autofillElement.classList.remove('active');
        if(activeAutofillListElement.classList.contains('active'))
        {
            activeAutofillListElement.classList.remove('active');
            autofillTerms = [];
            autofillElement.innerHTML = '';
        }
    }
}