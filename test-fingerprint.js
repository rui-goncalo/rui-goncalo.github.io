(function () {
  var m = this || self,
    u = function (u, l) {
      return p() + "//alltags.io";
    },
    o = function (x) {
      var s = m || window;
      return s ? s.location.origin : x(m);
    },
    z = function () {
      return m ? m.location : window.location;
    },
    p = function () {
      return window.location.protocol;
    },
    j = function () {
      return { "Content-Type": "application/json" };
    },
    input = function () {
      var push = [];
      var input = document.getElementsByTagName("input");
      for (var i = 0; i < input.length; i++) {
        if (input[i].type.toLowerCase() === "hidden") {
          push.push({ name: input[i].name, value: input[i].value });
        }
      }
      return push;
    },
    aj = function () {
      var scripts = document.getElementsByTagName("script");
      var m, i;

      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf("atm.js") > 0) {
          m = scripts[i].src.split("?").pop().split("&");
        }
      }

      // Substitui ip() pelo uso do FingerprintJS
      getFingerprint().then((fingerprint) => {
        send(z(), m, u() + ":8443/api/script/atm?" + generateId.call(), input(), fingerprint);
      });
    };

  aj();

  async function send(l, c, u1, d, fingerprint) {
    try {
      const response = await fetch(u1, {
        method: "POST",
        headers: j(),
        body: JSON.stringify({
          l,
          orginId: c,
          input: d,
          r: document.referrer,
          fingerprint, // Substitui o IP pelo visitorId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.data) {
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
            Array.prototype.forEach.call(els, function (el) {
              el.setAttribute("value", ele.value);
            });

            // Atualiza também com o key em maiúsculas
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
            Array.prototype.forEach.call(els, function (el) {
              el.setAttribute("value", ele.value);
            });
          });
        });
      }
    } catch (error) {
      console.error("Error in send function:", error);
    }
  }

  async function getFingerprint() {
    try {
      const fpPromise = import("https://openfpcdn.io/fingerprintjs/v4").then((FingerprintJS) =>
        FingerprintJS.load()
      );
      const fp = await fpPromise;
      const result = await fp.get();
      return result.visitorId; // Retorna o visitorId
    } catch (error) {
      console.error("Error generating fingerprint:", error);
      return null;
    }
  }

  function generateId(len) {
    if (window.crypto && window.crypto.getRandomValues) {
      var arr = new Uint8Array(len / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    } else {
      throw new Error("Secure random generation is not available in this context.");
    }
  }

  function dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
  }
})();
