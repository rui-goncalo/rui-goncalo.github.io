(function() {
  var m = this || self, 
  u = function(u,l){
    return p()+"//alltags.io";
  },
  o = function(x){
    var s = m || window;
    return s ? s.location.origin : x(m);
  },
  n = function(t){
    var method = ["GET", "POST"];
    return method[t];
  },
  x = function (m){
    var f = m || window;
    return f.location.origin;
  },
  z = function(){
    return m ? m.location : window.location;
  }, 
  p = function(){
    return window.location.protocol;
  },
  j = function() {
    return {'Content-Type': 'application/json'};
  },
  input = function() {
    var push = [];
    var input = document.getElementsByTagName("input");
    for (var i = 0; i < input.length; i++) {
      if (input[i].type.toLowerCase() === "hidden") {
        push.push({"name": input[i].name, "value": input[i].value});
      }
    }
    return push;  
  },
  send = async function(l, c, u1, d, h1) {
    let response = await fetch(u1, {
      method: "POST",
      headers: j(),
      body: JSON.stringify({
        "l": l,
        "originId": c,
        "input": d,
        "r": document.referrer,
        "ip": await ip()
      })
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.data) {
        data.data.forEach((ele) => {
          var newKeyList = ele.key.split(",");
          newKeyList.forEach((new_key) => {
            ele.key = new_key;
            var myEle = document.getElementById(ele.key);

            if (myEle != null) { 
              document.getElementById(ele.key).value = ele.value; 
            } else {
              if (document.getElementsByName(ele.key)[0] && document.getElementsByName(ele.key)[0].name) {
                document.getElementsByName(ele.key)[0].value = ele.value;
              }
            }
            var els = document.getElementsByName(ele.key);
            Array.prototype.forEach.call(els, function(el) {
              el.setAttribute('value', ele.value);
            });

            var newKey = ele.key.toUpperCase();
            var myEle1 = document.getElementById(newKey);

            if (myEle1 != null) { 
              document.getElementById(newKey).value = ele.value; 
            } else {
              if (document.getElementsByName(newKey)[0] && document.getElementsByName(newKey)[0].name) {
                document.getElementsByName(newKey)[0].value = ele.value;
              }
            }
            var els = document.getElementsByName(newKey);
            Array.prototype.forEach.call(els, function(el) {
              el.setAttribute('value', ele.value);
            });
          });
        });
      }
    });
  },
  aj = function() {
    var scripts = document.getElementsByTagName("script");
    var m, i, p;

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('atm.js') > 0) {
        i = scripts[i].src.split("?").pop().split("&");
      }
      m = i;
    }

    send(z(), m, u() + ":8443/api/script/atm?" + generateId(40), input());
  }; aj();

  function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
  }

  function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  }
})();

async function ip() {
  try {
    // Carregar dinamicamente o ClientJS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clientjs/0.1.11/client.min.js';
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        try {
          const client = new ClientJS();
          const fingerprint = client.getFingerprint();

          // Encripta o resultado antes de retornar
          resolve(Encrypt(fingerprint));
        } catch (error) {
          console.error("Error generating fingerprint:", error);
          reject(null);
        }
      };

      script.onerror = () => {
        console.error("Failed to load ClientJS");
        reject(null);
      };

      document.head.appendChild(script);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}


function Encrypt(value) {
  var result = "";
  for (var i = 0; i < value.length; i++) {
    if (i < value.length - 1) {
      result += value.charCodeAt(i) + 10;
      result += "-";
    } else {
      result += value.charCodeAt(i) + 10;
    }
  }
  return result;
}
