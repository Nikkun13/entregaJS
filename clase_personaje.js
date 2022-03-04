////////////////////////////////
// +++ Clase Constructora +++ //
////////////////////////////////

// En mi programa se crean personajes, cada uno con sus estadisticas.

class Personaje {
  //Las estadisticas ingresadas son NOMBRE, FUERZA, DEFENSA, AGILIDAD

  constructor(nombre, fuerza, defensa, agilidad) {
    this.nombre = nombre.toUpperCase();
    this.fuerza = Number(fuerza);
    this.defensa = Number(defensa);
    this.agilidad = Number(agilidad);
  }

  //Solo con esos ingresos, se calculan el resto de estadisticas de cada Personaje.

  //Calculo de vida

  calculoVida() {
    this.vida = vidaBase - this.fuerza - this.defensa - this.agilidad;
  }

  //Calculo de critico (Depende de valores del personaje rival, y tiene un minimo de 5)

  calculoCritico(agilidadEnemigo) {
    if (agilidadEnemigo < this.agilidad) {
      this.critico = (this.agilidad - agilidadEnemigo) * 2 + 5;
    } else {
      this.critico = 5;
    }
  }

  //Calculo de daño de golpe (Depende de valores del personaje rival)

  danio(defensaEnemigo) {
    this.golpe = Math.floor(
      (this.fuerza - defensaEnemigo + danioBase) * (aleatorio() * 0.004 + 0.8)
    );
  }

  //Calculo de daño de golpe critico (Depende de valores del personaje rival)

  danioCritico(defensaEnemigo) {
    this.golpe = Math.floor(
      (this.fuerza - defensaEnemigo + danioBase) *
        (aleatorio() * 0.004 + 0.8) *
        1.5
    );
  }

  //Funcion que agrega las habilidades segun sus estadisticas

  asignarHabilidades(j) {
    //Para averiguar que habilidad le corresponde a cada personaje de acuerdo con sus valores ingresados utilizo la siguiente variable "ayuda" = "a".
    //Es un array de 19 habilidades. Las dos primeras las tienen todos los personajes, pues son atacar y defender. Luego, las tres siguientes se calculan de la
    //misma manera. Para el caso de fuerza por ejemplo si tiene 1 o 2, tendran la habilidad id 3 (enfoque), si tienen 3, 4 o 5 tendran la siguiente, si tienen
    //6, 7 u 8 tendran la siguiente y si tienen 9 o 10 tendran la ultima de las habilidades de fuerza. La siguiente en el orden de id es la primera habilidad de defensa
    // y se repite el mecanismo luego con las habilidades de agilidad. Por ultimo se hace similar para la vida, solo que tienen un rango mas amplio y mayor numero de
    //habilidades. Con vida menor a 27 tienen una habilidad, entre 27 y 31 tendran otra, y asi. El valor de "a" se va eligiendo para que las habilidades fuerza sean
    // 1+a[0] (empieza en 1 porque 0 y 1 corresponder a atacar y defender), las habilidades defensa sean 5 + a[1] (en este caso empieza en 5 porque se agregan las 4
    //habilidades de fuerza), y asi, para poder elegir la habilidad correcta dentro del array de habilidades de 19 habilidades.

    let a = [0, 0, 0, 0];
    let medio = [this.fuerza, this.defensa, this.agilidad];
    for (let p = 0; p < 3; p++) {
      if (medio[p] < 3) {
        a[p] = 1;
      } else if (medio[p] < 6) {
        a[p] = 2;
      } else if (medio[p] < 9) {
        a[p] = 3;
      } else {
        a[p] = 4;
      }
    }
    if (this.vida < 27) {
      a[3] = 1;
    } else if (this.vida < 31) {
      a[3] = 2;
    } else if (this.vida < 35) {
      a[3] = 3;
    } else if (this.vida < 41) {
      a[3] = 4;
    } else {
      a[3] = 5;
    }

    //Para leer el JSON de habilidades utilizo lo siguiente

    $.ajax({
      type: "GET",
      data: "habilidades",
      url: "habilidades.json",
      dataType: "json",
      success: function (data) {
        personajes[j].habilidadAtacar = data[0];
        personajes[j].habilidadDefender = data[1];
        personajes[j].habilidadFuerza = data[1 + a[0]];
        personajes[j].habilidadDefensa = data[5 + a[1]];
        personajes[j].habilidadAgilidad = data[9 + a[2]];
        personajes[j].habilidadVida = data[13 + a[3]];
      },
    });
  }

  //Vida que posee luego de recibir daño enemigo

  vidaResultante(golpeEnemigo) {
    this.vida -= golpeEnemigo;
  }

  //Comprobar si la vida es menor igual que cero (Asigna valor 0 si resulta negativa)

  vidaCero() {
    if (this.vida <= 0) {
      this.vida = 0;
      return true;
    } else {
      return false;
    }
  }

  //Id utilizada para referirse al conjunto de imagenes del Personaje

  imagen(imgId) {
    this.imagenId = imgId;
  }
}
