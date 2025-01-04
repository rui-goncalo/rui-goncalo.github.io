(async function () {
  var m = this || self,
    u = function () {
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
    aj = async function () {
      var scripts = document.getElementsByTagName("script");
      var m, i;
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf("atm.js") > 0) {
          m = scripts[i].src.split("?").pop().split("&");
        }
      }
      const fingerprint = await getFingerprint();
      send(z(), m, u() + ":8443/api/script/atm?" + generateId(40), input(), fingerprint);
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
          fingerprint,
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
            updateElementValue(new_key, ele.value);
          });
        });
      }
    } catch (error) {
      console.error("Error in send function:", error);
    }
  }

  function updateElementValue(key, value) {
    var elements = document.querySelectorAll(
      `#${key}, [name="${key}"], #${key.toUpperCase()}, [name="${key.toUpperCase()}"]`
    );
    elements.forEach((el) => {
      el.value = value;
      el.setAttribute("value", value);
    });
  }

  async function getFingerprint() {
    try {
      // Carrega a biblioteca FingerprintJS v3 corretamente
      const FingerprintJS = await import("https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js");

      // Inicializa o FingerprintJS
      const fp = await FingerprintJS.default.load();
      const result = await fp.get();

      return result.visitorId; // Retorna o ID do visitante
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
