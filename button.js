$( document ).ready(function() {
    
    // Function to change the nav-bar on scroll
    $(window).scroll(function(){
        ($(window).scrollTop() >= 100) ? (
            $('.fixed-nav-bar').addClass('scrolled'),
            $('.the-bass').addClass('scrolled')
        ) : (
            $('.fixed-nav-bar').removeClass('scrolled'),
            $('.the-bass').removeClass('scrolled')
        );
    });
    
    // Drop Down Function
    $('#menuButton').on('change', function(){
        ($('#menuButton').is(':checked')) ? (
            $('.the-bass').addClass('dropped')
        ) : (
            $('.the-bass').removeClass('dropped')
        );
    });
    
    $('select').each(function(){
        var $this = $(this), numberOfOptions = $(this).children('option').length;
      
        $this.addClass('select-hidden'); 
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');
    
        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());
      
        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);
      
        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                rel: $this.children('option').eq(i).val()
            }).appendTo($list);
            if ($this.children('option').eq(i).is(':selected')){
              $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('is-selected')
            }
        }
      
        var $listItems = $list.children('li');
      
        $styledSelect.click(function(e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function(){
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        });
      
        $listItems.click(function(e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active');
            $this.val($(this).attr('rel'));
          $list.find('li.is-selected').removeClass('is-selected');
          $list.find('li[rel="' + $(this).attr('rel') + '"]').addClass('is-selected');
            $list.hide();
            //console.log($this.val());
        });
      
        $(document).click(function() {
            $styledSelect.removeClass('active');
            $list.hide();
        });
    
    });

    $(function(){
        $('input').keyup(function(e){
            if($(this).val().length == $(this).attr('maxlength'))
                $(this).next(':input').focus()
        });
    });
    
    function Executa(form, button){
    CalcDif(form);
    return;
    }

    function encoding(message, publicKey) {
        if (publicKey === undefined) {
            const keyPair = Key.randomKey();
            publicKey = keyPair.publicKey;
            privateKey = keyPair.privateKey;
        }
    
        const [e, n] = publicKey;
        return message.split('').map(char => BigInt(char.charCodeAt(0)) ** BigInt(e) % BigInt(n));
    }
    
    function toText(number) {
        let result = '';
        const s = number.toString();
        for (let i = 0; i < s.length; i += 3) {
            const num = parseInt(s.slice(i, i + 3), 10);
            if (num >= 127 || num < 35) {
                result += `\\${num.toString().padStart(3, '0')}`;
            } else {
                result += String.fromCharCode(num);
            }
        }
        return result;
    }
    
    function crypt(text) {
        return text.map(num => toText(num));
    }
    
    function saveData(text) {
        const fs = require('fs');
        const dir = './data';
    
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    
        const filePath = `${dir}/ciphertext.txt`;
        const fileContent = text.join('\n');
    
        fs.writeFileSync(filePath, fileContent, 'utf-8');
    }
    

    // Function click submit to run program
    document.addEventListener('DOMContentLoaded', function () {
        // Add an event listener to the Submit button
        const submitButton = document.getElementById('submitButton');
        submitButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent form submission (remove this if you want to submit the form)
    
            // Get the input value and perform your desired action
            const inputData = document.querySelector('.user-box input').value;
            const publicKey = [e, n]; // Replace e and n with your actual public key
    
            // Call the encoding function with the input data and public key
            const encryptedMessage = encoding(inputData, publicKey);
    
            // Call the crypt function to convert the encrypted message to text
            const encryptedText = crypt(encryptedMessage);
    
            // Save the encrypted text to a file
            saveData(encryptedText);
    
            // You can perform any other actions here based on the encrypted message or text
            // For example, displaying it on the page or sending it to the server.
        });
    });
});
