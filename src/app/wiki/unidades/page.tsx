"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

interface Unidad {
    id: string
    nombre: string
    categoria: string
    vida: number
    defensa: number
    ataque: number
    habilidadEspecial: string
    descripcion: string
    tecnica: string
    habilidad: string
    impacto: string
    imagen: string
}

const unidades: Unidad[] = [
    {
        id: "avispero_acido",
        nombre: "Avíspero Acido",
        categoria: "Artillería",
        vida: 40,
        defensa: 30,
        ataque: 65,
        habilidadEspecial: "<b>Lluvia Fórmica</b>: Ataque de área que reduce la defensa de las unidades impactadas por 2 turnos.",
        descripcion: "El Avispero Ácido es la unidad de artillería básica, pero esencial, de la Legión. Está compuesto por las obreras mayores de Formica rufa, conocidas en el mundo real como las Hormigas Rojas del Bosque.",
        tecnica: "Técnica de Combate: Su arma principal no es la mordida o el aguijón, sino la potente secreción de su glándula abdominal.",
        habilidad: "Se basa directamente en su defensa real. Estas hormigas son famosas por poder rociar ácido fórmico a distancias considerables (hasta 30 cm) para defender su hormiguero o paralizar a sus presas. Este ácido es corrosivo y sirve como un eficaz agente químico de combate, justificando la reducción de defensa en el juego.",
        impacto: "Impacto Ambiental: Son arquitectas increíbles. Sus colonias construyen enormes montículos con agujas de pino y tierra, que pueden alcanzar varios metros de altura, usándolos como una fortaleza solar. En el juego, esto simboliza la organización y el apoyo logístico detrás de esta unidad.",
        imagen: "/unidades/avispero_acido.png",
    }, {
        id: "bomba_melosa",
        nombre: "Bomba Melosa",
        categoria: "Artillería",
        vida: 35,
        defensa: 25,
        ataque: 60,
        habilidadEspecial: "<b>Sacrificio de Colapso</b>: Al morir, inflige 50 de daño de área y aplica un efecto de 'Ralentización' al enemigo.",
        descripcion: "La Bomba Melosa es una unidad de último recurso, venerada por su sacrificio en batalla. Estas obreras, de la especie Camponotus saundersi, poseen una habilidad defensiva que se convierte en una estrategia ofensiva devastadora en el juego.",
        tecnica: "Técnica de Combate: Su estrategia se llama autotisis. Estas hormigas obreras tienen glándulas mandibulares extremadamente grandes que se extienden por casi todo su cuerpo. Están llenas de una secreción defensiva pegajosa y tóxica.",
        habilidad: "Se basa directamente en la autotisis. Cuando la hormiga se siente amenazada de muerte, contrae violentamente sus músculos abdominales hasta que su cuerpo se rompe. Este acto libera la sustancia pegajosa tóxica en un chorro que inmoviliza y repele a los atacantes, justificando el daño de área y el efecto de 'Ralentización' (por el pegamento viscoso).",
        impacto: "Costo y Valor: Su bajo PV refleja su naturaleza inherentemente frágil y su destino: estas unidades no están destinadas a sobrevivir a un enfrentamiento. Su alto ATQ y efecto de área al morir representan la gran potencia de su carga química. El término 'Melosa' hace referencia a la sustancia interna que, aunque tóxica, es altamente viscosa y similar a un jarabe.",
        imagen: "/unidades/bomba_melosa.png",
    }, {
        id: "cazador_nomada",
        nombre: "Cazador Nómada",
        categoria: "Artillería",
        vida: 45,
        defensa: 35,
        ataque: 55,
        habilidadEspecial: "<b>Aguijón de Fuego</b>: 20% de probabilidad de infligir daño por quemadura durante 3 turnos (Daño en el Tiempo, DoT).",
        descripcion: "Los Cazadores Nómadas forman la vanguardia de las operaciones de asedio. Su capacidad para coordinar ataques masivos y su veneno cáustico los convierten en una amenaza persistente. Son reclutados de la especie invasora Solenopsis invicta, apodada con razón la 'Hormiga de Fuego'.",
        tecnica: "Técnica de Combate: A diferencia de muchas otras especies que solo muerden, las Solenopsis invicta utilizan sus mandíbulas para agarrar a la víctima y luego rotan su abdomen para inyectar repetidamente veneno con su aguijón.",
        habilidad: "El nombre 'Hormiga de Fuego' proviene de la intensa y duradera sensación de ardor que produce su veneno. Este veneno es alcaloide (solenopsina) y causa pústulas estériles, lo que se traduce directamente en el juego como un efecto de Daño en el Tiempo (DoT) o 'quemadura', que persiste más allá del ataque inicial. El veneno es tan efectivo que un pequeño porcentaje de ataques continuará causando estragos.",
        impacto: "Comportamiento Nómada: Su nombre de unidad refleja su naturaleza invasora y colonizadora. Son maestras en formar balsas vivientes al entrelazarse cuando hay inundaciones, una demostración de resistencia y coordinación colectiva.",
        imagen: "/unidades/cazador_nomada.png",
    }, {
        id: "francotirador_viscoso",
        nombre: "Francotirador Viscoso",
        categoria: "Artillería",
        vida: 50,
        defensa: 40,
        ataque: 60,
        habilidadEspecial: "<b>Tiro Paralizante</b>: 15% de probabilidad de aturdir al objetivo por un turno con su veneno neurotóxico.",
        descripcion: "El Francotirador Viscoso es el especialista de largo alcance de la legión, capaz de inmovilizar objetivos clave con una precisión mortal. Esta unidad toma su poder del veneno rápido y potente de la Myrmecia pilosula, un grupo conocido por su agresividad e impresionante capacidad visual.",
        tecnica: "Técnica de Combate: Las hormigas del género Myrmecia poseen una de las visiones más agudas entre todas las hormigas, lo que justifica su rol de 'Francotirador'. Aunque son grandes y agresivas, su ataque principal es a corta distancia, utilizando un aguijón para inyectar su veneno. Adaptamos esto al juego como un ataque de artillería de largo alcance y alta precisión.",
        habilidad: "El veneno de Myrmecia es potente y, en el mundo real, puede ser peligroso para los humanos (causando reacciones anafilácticas severas). El componente neurotóxico del veneno es el que inspira la habilidad Tiro Paralizante, ya que interfiere con el sistema nervioso de la víctima, causando un 'aturdimiento' o inmovilización temporal.",
        impacto: "Agresividad y Tamaño: Su alto PV y DEF, en comparación con otras unidades de artillería, reflejan el tamaño inusualmente grande y la naturaleza extremadamente territorial de estas hormigas.",
        imagen: "/unidades/francotirador_viscoso.png",
    }, {
        id: "catapulta_semillas",
        nombre: "Catapulta de Semillas",
        categoria: "Artillería",
        vida: 55,
        defensa: 45,
        ataque: 50,
        habilidadEspecial: "<b>Impacto Contundente</b>: Ataque que ignora el 30% de la armadura base del objetivo.",
        descripcion: "La Catapulta de Semillas es el ariete de la artillería, especializada en romper defensas fortificadas. Esta unidad está formada por los soldados mayores (Majors) de Pheidole megacephala, una especie conocida mundialmente por su naturaleza invasiva y sus cabezas desproporcionadamente grandes.",
        tecnica: "Técnica de Combate: Si bien las hormigas de este género son conocidas como hormigas cosechadoras (algunas especies usan sus mandíbulas para triturar semillas), la casta Mayor de Pheidole posee mandíbulas y músculos cefálicos masivos, diseñados para triturar objetos duros. Su poder reside en la fuerza bruta de su mordida.",
        habilidad: "Se inspira en esta tremenda fuerza de trituración. En lugar de lanzar químicos o venenos, lanzan proyectiles pequeños y densos con una potencia tremenda (como semillas o pequeños guijarros). El impacto es tan violento que, al igual que una trituradora, ignora o rompe una porción de la armadura (DEF) del enemigo. Su robustez se refleja en su PV y DEF, notablemente más altos que otras unidades de Artillería química.",
        impacto: "Dualidad de Castas: El nombre de la unidad se burla ligeramente de su función original (procesar semillas), reorientándola a una función militar: usar esa misma capacidad de trituración como un arma de asalto.",
        imagen: "/unidades/catapulta_semillas.png",
    }, {
        id: "rociador_toxico",
        nombre: "Rociador Tóxico",
        categoria: "Artillería",
        vida: 38,
        defensa: 28,
        ataque: 62,
        habilidadEspecial: "<b>Niebla Irritante</b>: Reduce la precisión de ataque de las unidades enemigas cercanas por 1 turno.",
        descripcion: "El Rociador Tóxico es una unidad de apoyo químico especializada en el control de multitudes y la desorganización de las filas enemigas. Estas unidades están formadas por la especie Oecophylla smaragdina, famosas en el Sureste Asiático y Australia por construir nidos vivos cosiendo hojas.",
        tecnica: "Técnica de Combate: Cuando se sienten amenazadas, estas hormigas no solo muerden dolorosamente, sino que también rocían un chorro de ácido fórmico. Son menos precisas que el Avispero Ácido, pero la nube química tiene un efecto más irritante y desorientador.",
        habilidad: "Se basa en que el ácido fórmico, aunque no siempre letal, es extremadamente irritante para los ojos y las membranas mucosas. En la guerra de hormigas, una nube de este ácido en el aire podría cegar o desorientar momentáneamente a los combatientes, haciendo que sus ataques fallen, lo que se traduce en una reducción de la precisión de ataque (debuff de precisión).",
        impacto: "Organización: Su bajo PV refleja el cuerpo relativamente delgado de las obreras. Sin embargo, en el juego representan la sofisticación y la capacidad de las colonias tejedoras para organizar y movilizar defensas rápidamente.",
        imagen: "/unidades/rociador_toxico.png",
    }, {
        id: "escupidor_lodo",
        nombre: "Escupidor de Lodo",
        categoria: "Artillería",
        vida: 42,
        defensa: 32,
        ataque: 58,
        habilidadEspecial: "<b>Defensa Química</b>: Lanza una secreción que desorienta. Reduce el daño del próximo ataque recibido por el objetivo en 50%.",
        descripcion: "El Escupidor de Lodo es una unidad de soporte que utiliza sus peculiares secreciones defensivas para desarmar y confundir al enemigo. Se compone de obreras de la especie Crematogaster spp., famosas por levantar su abdomen en alto (como acróbatas) cuando son molestadas.",
        tecnica: "Técnica de Combate: Cuando son atacadas, estas hormigas tienen la capacidad de secretar una sustancia pegajosa o química desde la punta de su abdomen. Aunque no siempre es un veneno potente, esta secreción sirve para desorientar, confundir y complicar el ataque del agresor, y a menudo tiene un olor desagradable.",
        habilidad: "Modela el efecto desorientador de esta secreción. Al ser rociado con el 'lodo' (que puede ser resina vegetal o su propia secreción), el enemigo se distrae, se limpia o se enreda, lo que interfiere con la precisión y la fuerza de su siguiente asalto. Esto se traduce en una reducción del 50% del daño del próximo ataque que reciba la unidad marcada.",
        impacto: "Aspecto Único: Su nombre de unidad y su bajo ATQ reflejan que su fuerza no está en el ataque directo, sino en la táctica de apoyo y defensa química, usando la secreción como un proyectil que confunde antes de dañar.",
        imagen: "/unidades/escupidor_lodo.png",
    }, {
        id: "guardian_alquitran",
        nombre: "Guardian de Alquitrán",
        categoria: "Artillería",
        vida: 48,
        defensa: 38,
        ataque: 52,
        habilidadEspecial: "Trampa de Resina: Ataque a distancia que tiene un 10% de probabilidad de inmovilizar al objetivo por 1 turno.",
        descripcion: "El Guardián de Alquitrán es una unidad de soporte táctico, vital para fijar enemigos y evitar flanqueos. Representa a las especies de Aphaenogaster, conocidas por su comportamiento de forrajeo y, crucialmente, por su uso ocasional de materiales pegajosos o resinas como parte de su vida colonial.",
        tecnica: "Técnica de Combate: Algunas especies de Aphaenogaster son conocidas por utilizar elementos ambientales, como semillas de ciertas plantas que son inherentemente pegajosas, o incluso resinas defensivas, para manipular su entorno. En el juego, esta característica se exagera para crear un arma táctica.",
        habilidad: "Se basa en el principio de inmovilización a través de sustancias naturales pegajosas. El Guardián lanza un proyectil de 'alquitrán' (resina vegetal procesada) con el objetivo de enredar las patas y extremidades de la unidad enemiga, paralizando su movimiento. Esto se traduce en el juego como una probabilidad de inmovilización por un turno, deteniendo completamente a la unidad afectada.",
        impacto: "Rol Táctico: Su ATQ y DEF promedio indican que su valor no reside en el combate directo, sino en su capacidad para aplicar efectos de control de masas a distancia, manteniendo a raya a las amenazas más móviles.",
        imagen: "/unidades/guardian_alquitran.png",
    }, {
        id: "asedio_polvo",
        nombre: "Asedio de Polvo",
        categoria: "Artillería",
        vida: 46,
        defensa: 36,
        ataque: 54,
        habilidadEspecial: "<b>Nube de Polvo</b>: Oculta a las unidades amigas adyacentes, otorgándoles un 10% de evasión.",
        descripcion: "El Asedio de Polvo es una unidad de soporte táctico que emplea su conocimiento del entorno para proteger a sus aliados. Se recluta de la especie Pogonomyrmex spp., hormigas robustas de América del Norte famosas por recolectar semillas y construir sus extensos nidos en suelos secos y arenosos.",
        tecnica: "Técnica de Combate: Si bien estas hormigas son conocidas por sus poderosas picaduras y venenos que causan dolor intenso, su presencia constante en terrenos áridos y secos hace que constantemente muevan grandes cantidades de tierra y arena fina alrededor de la entrada de sus nidos.",
        habilidad: "Se inspira en el entorno de estas hormigas y la forma en que excavan. El Asedio de Polvo utiliza sus potentes mandíbulas y patas para levantar rápidamente una cortina de fina tierra o arena en el campo de batalla. Esta nube no es tóxica, sino que sirve para interferir con la visión de los enemigos (dándoles una oportunidad de fallo) y ocultar a los aliados, lo que se traduce en un bono de evasión.",
        impacto: "Resistencia: Su nombre de unidad 'Asedio' refleja su tenacidad en ambientes duros, mientras que sus estadísticas equilibradas de PV y DEF reflejan la dureza de su exoesqueleto.",
        imagen: "/unidades/asedio_polvo.png",
    }, {
        id: "toxina_tunel",
        nombre: "Toxina de Túnel",
        categoria: "Artillería",
        vida: 32,
        defensa: 22,
        ataque: 72,
        habilidadEspecial: "<b>Golpe Crítico Táctico</b>: El primer ataque después de moverse tiene un 50% de probabilidad de ser crítico.",
        descripcion: "La Toxina de Túnel es el golpeador móvil y de alto riesgo de la artillería. Se compone de las pequeñas, pero ágiles obreras de Lasius niger. Su fuerza reside en la emboscada y la maniobra, más que en la resistencia.",
        tecnica: "Técnica de Combate: Lasius niger, aunque pequeña, utiliza el ácido fórmico para defenderse y paralizar presas pequeñas. Su naturaleza oportunista y su habilidad para colonizar y moverse por túneles y grietas rápidamente se convierte en una ventaja táctica.",
        habilidad: "Se inspira en la idea de que esta hormiga realiza ataques relámpago, emboscando al enemigo después de una maniobra rápida (mover). Su cuerpo es frágil (bajo PV y DEF) pero su potencial de daño es alto (alto ATQ). El uso de la 'Toxina' (ácido fórmico) se aplica con precisión quirúrgica en el primer contacto después de reposicionarse, asegurando un golpe que tiene una alta probabilidad de ser devastadoramente efectivo (crítico).",
        impacto: "Movilidad y Fragilidad: El balance de sus estadísticas refleja su naturaleza: es una unidad de cristal, que inflige gran daño si se usa para golpear y huir, pero sucumbe rápidamente si es capturada en combate.",
        imagen: "/unidades/toxina_tunel.png",
    }, {
        id: "enjambre_errante",
        nombre: "Enjambre Errante",
        categoria: "Infantería Ligera",
        vida: 50,
        defensa: 40,
        ataque: 75,
        habilidadEspecial: "<b>Frenesí de Cuchillas</b>: Por cada 5 unidades del Enjambre Errante en el campo, el daño de ataque aumenta un 5% (Acumulable).",
        descripcion: "El Enjambre Errante no es una unidad individual, sino una marea. Representa la brutal fuerza colectiva de las Hormigas Guerreras (Dorylus o Siafu). Carecen de un nido permanente, moviéndose en columnas masivas que consumen todo a su paso. Son los limpiadores implacables del campo de batalla.",
        tecnica: "Técnica de Combate: Las hormigas guerreras son ciegas y dependen enteramente de las feromonas y el contacto físico. Atacan en masa, inmovilizando a sus presas con números abrumadores y potentes mordeduras. Los soldados mayores tienen mandíbulas descomunales.",
        habilidad: "Modela su táctica principal: la saturación numérica. Su efectividad aumenta drásticamente con la concentración de tropas, ya que el poder de un Enjambre Errante radica en el número, no en la resistencia individual. Esto recompensa al jugador por mantener una alta densidad de estas unidades.",
        impacto: "Poder de la Mandíbula: El alto ATQ refleja la fuerza de las mandíbulas de los soldados mayores de Dorylus, que son tan poderosas que en algunas culturas africanas se han utilizado para suturar heridas, actuando como grapas vivientes.",
        imagen: "/unidades/enjambre_errante.png",
    }, {
        id: "asaltante_saltador",
        nombre: "Asaltante Saltador",
        categoria: "Infantería Ligera",
        vida: 55,
        defensa: 45,
        ataque: 60,
        habilidadEspecial: "<b>Maniobra de Flanqueo</b>: Otorga +20% de daño al atacar a unidades que ya están trabadas en combate.",
        descripcion: "El Asaltante Saltador es el especialista en escaramuzas y el cazador emboscador de la legión ligera. Utiliza una agilidad inigualable para posicionarse estratégicamente, explotando las debilidades del enemigo. Se basa en Harpegnathos saltator, una especie con una habilidad de salto muy desarrollada.",
        tecnica: "Técnica de Combate: A diferencia de la mayoría de las hormigas, que solo corren, estas hormigas pueden saltar distancias significativas (varios centímetros) tanto para atrapar presas como para escapar del peligro. Este salto es provocado por una rápida liberación de energía acumulada en sus patas.",
        habilidad: "Refleja su rol de cazador ágil que no se involucra en combates directos frontales, sino que usa su velocidad y capacidad de salto para rodear a la presa distraída por otro combate. Atacan donde el objetivo es vulnerable y no puede defenderse eficazmente, justificando el bono de daño al atacar enemigos 'trabados'.",
        impacto: "Fisiología Única: Sus estadísticas de PV y DEF moderados, junto con un ATQ sólido, reflejan que son cazadores competentes, aunque no están diseñados para resistir una pelea de desgaste.",
        imagen: "/unidades/asaltante_saltador.png",
    }, {
        id: "piquete_mandibular",
        nombre: "Piquete Mandibular",
        categoria: "Infantería Ligera",
        vida: 40,
        defensa: 35,
        ataque: 80,
        habilidadEspecial: "<b>Golpe de Precisión</b>: Su ataque tiene un 30% de probabilidad de ignorar la defensa del objetivo.",
        descripcion: "El Piquete Mandibular es el asesino rápido de la legión, sacrificando durabilidad por una letalidad pura. Sus obreras, de la especie Odontomachus, poseen las mandíbulas de cierre más rápidas del reino animal, utilizándolas tanto para atacar como para escapar.",
        tecnica: "Técnica de Combate: Estas hormigas tienen mandíbulas alargadas que se mantienen abiertas y se cierran con una fuerza y velocidad extremas, ¡alcanzando velocidades de hasta 230 km/h en solo 0.13 milisegundos! Utilizan este 'golpe de resorte' no solo para matar presas, sino también para impulsarse en el aire y saltar hacia atrás o hacia los lados para escapar de amenazas.",
        habilidad: "Modela la fuerza concentrada y la velocidad de su impacto. Un golpe tan rápido y potente permite que la mandíbula encuentre microfisuras o puntos débiles en el blindaje del enemigo, ignorando efectivamente la defensa al momento del impacto. Su altísimo ATQ refleja esta letalidad. Su bajo PV y DEF reflejan que son cazadores, no tanques.",
        impacto: "Función Doble: El nombre 'Piquete' hace referencia a la función de su ataque, que no es solo morder, sino apuñalar o punzar con la punta de sus mandíbulas, capaces de perforar con fuerza.",
        imagen: "/unidades/piquete_mandibular.png",
    }, {
        id: "corredor_fantasma",
        nombre: "Corredor Fantasma",
        categoria: "Infantería Ligera",
        vida: 30,
        defensa: 30,
        ataque: 70,
        habilidadEspecial: "<b>Velocidad Extrema</b>: La unidad tiene un 40% de probabilidad de esquivar ataques de artillería.",
        descripcion: "El Corredor Fantasma es la unidad más rápida de la legión, utilizando la velocidad pura para evadir el peligro. Está compuesta por las legendarias Cataglyphis, la única especie capaz de forrajear en el abrasador calor del desierto del Sahara, donde las temperaturas de la arena pueden superar los 60∘C.",
        tecnica: "Técnica de Combate: Su estrategia de supervivencia es la velocidad implacable. Utilizan patas inusualmente largas para levantar sus cuerpos del suelo caliente y corren a velocidades impresionantes para encontrar comida antes de que el calor las mate. En el juego, esta velocidad se traduce en una capacidad superior de evasión.",
        habilidad: "Está directamente relacionada con su habilidad para moverse más rápido que la mayoría de los proyectiles de los enemigos. Su velocidad y patrones de carrera erráticos les permiten esquivar los ataques a distancia (Artillería) que dependen de la predicción de movimiento, otorgándoles una alta probabilidad de evasión.",
        impacto: "Resistencia Frágil: Sus estadísticas muy bajas de PV y DEF reflejan que, aunque son rápidas, son extremadamente vulnerables. Si son alcanzadas, caen inmediatamente. Su supervivencia depende totalmente de su velocidad.",
        imagen: "/unidades/corredor_fantasma.png",
    }, {
        id: "fuerza_hormiguero",
        nombre: "Fuerza Hormiguero",
        categoria: "Infantería Ligera",
        vida: 52,
        defensa: 42,
        ataque: 65,
        habilidadEspecial: "<b>Refuerzos Incesantes</b>: Si esta unidad es destruida, hay un 50% de probabilidad de que una unidad de 'Recluta' (PV: 20, ATQ: 30) aparezca en su lugar.",
        descripcion: "La Fuerza Hormiguero no lucha por territorio, sino que la guerra es su territorio. Estas unidades encarnan el poder de la supercolonia. Basadas en Linepithema humile, las Hormigas Argentinas son una de las especies invasoras más exitosas, formando supercolonias con millones de obreras que abarcan continentes.",
        tecnica: "Técnica de Combate: Su estrategia real es la guerra de saturación. Simplemente abruman al enemigo con números. Su bajo nivel de agresión individual se compensa con la increíble densidad de población y la ausencia de luchas internas entre nidos.",
        habilidad: "Modela esta capacidad de recuperación y la profundidad infinita de la supercolonia. Para el enemigo, matar a una unidad es a menudo inútil, ya que otra, aunque más débil ('Recluta'), aparece inmediatamente para mantener la presión y el control de área. El 50% de probabilidad representa la variabilidad del flujo de refuerzos del 'hormiguero'.",
        impacto: "Estadísticas Equilibradas: Sus estadísticas son sólidas, pero no excepcionales, reflejando que su fuerza proviene de la capacidad de reemplazo, no de la habilidad de combate individual.",
        imagen: "/unidades/fuerza_hormiguero.png",
    }, {
        id: "verdugo_sedoso",
        nombre: "Verdugo Sedoso",
        categoria: "Infantería Ligera",
        vida: 48,
        defensa: 38,
        ataque: 72,
        habilidadEspecial: "<b>Incursor de Esclavos</b>: Causa un 25% más de daño a unidades con baja moral o debuffs.",
        descripcion: "El Verdugo Sedoso es una unidad de élite centrada en la explotación y el castigo. Basado en la Polyergus rufescens, esta hormiga es una esclavista obligada. Sus mandíbulas están tan especializadas para la guerra y la incursión que no pueden alimentarse a sí mismas ni cuidar a sus crías; dependen completamente de las obreras que roban de colonias de hormigas del género Formica.",
        tecnica: "Técnica de Combate: Su estrategia real es la incursión relámpago. Entran en masa en los nidos de otras especies, infunden pánico y roban pupas que eclosionarán como sus obreras 'esclavas'.",
        habilidad: "Refleja su especialización para golpear a oponentes vulnerables. En el juego, las unidades con 'baja moral' o 'debuffs' (como Ralentización, Veneno, o Reducción de Defensa) se consideran debilitadas o desorganizadas. El Verdugo Sedoso está biológicamente adaptado para explotar la confusión y el miedo, infiriendo un daño extra a aquellos que ya han sido comprometidos por otras unidades.",
        impacto: "Estadísticas de Asesino: Su alto ATQ y PV moderado reflejan que son guerreros natos, con mandíbulas en forma de hoz optimizadas únicamente para la lucha.",
        imagen: "/unidades/verdugo_sedoso.png",
    }, {
        id: "saqueador_minusculo",
        nombre: "Saqueador Minúsculo",
        categoria: "Infantería Ligera",
        vida: 37,
        defensa: 32,
        ataque: 78,
        habilidadEspecial: "<b>Asalto Perfumado</b>: Al atacar, aplica un debuff que reduce la moral de las unidades enemigas adyacentes.",
        descripcion: "El Saqueador Minúsculo es pequeño, pero su verdadera arma es el terror químico. Basado en la Tapinoma sessile, esta unidad es notoria por su olor defensivo, a menudo descrito como coco podrido, queso azul o, más comúnmente, líquido de limpieza rancio. Es una plaga constante.",
        tecnica: "Técnica de Combate: Su estrategia principal no es infligir daño físico con la mordida, sino liberar un potente y nauseabundo olor (una feromona defensiva) cuando se sienten amenazadas o aplastadas. Este hedor es suficiente para disuadir a muchos depredadores.",
        habilidad: "Traduce este olor desagradable y perturbador en un debuff de combate. En el juego, la exposición a este 'perfume' químico en combate cuerpo a cuerpo reduce la moral o la voluntad de lucha de los enemigos cercanos, haciéndolos menos efectivos. Su alto ATQ compensa su fragilidad (bajo PV/DEF), ya que su letalidad reside en la ofensiva rápida.",
        impacto: "Naturaleza Invasora: Su apodo de 'Saqueador' se debe a su capacidad para invadir y establecer colonias en casi cualquier lugar, incluyendo estructuras humanas, moviéndose constantemente y buscando oportunidades.",
        imagen: "/unidades/saqueador_minusculo.png",
    }, {
        id: "guardian_escamas",
        nombre: "Guardian de Escamas",
        categoria: "Infantería Ligera",
        vida: 58,
        defensa: 48,
        ataque: 58,
        habilidadEspecial: "<b>Escudo de Avance</b>: Otorga +10 de defensa temporal a una unidad amiga que pase a través de su posición.",
        descripcion: "El Guardián de Escamas es una unidad de soporte de combate especializada en la protección de flancos y el aseguramiento de rutas de movimiento. Está compuesto por obreras mayores de Colobopsis truncata, famosas por su habilidad de frenar o sellar túneles usando sus cabezas especializadas.",
        tecnica: "Técnica de Combate: En la naturaleza, las obreras de esta especie tienen una cabeza plana, en forma de disco, conocida como 'escarizada'. Cuando están dentro de su nido, utilizan esta cabeza para encajar perfectamente en la entrada del túnel, bloqueando físicamente el paso a los invasores.",
        habilidad: "Modela la función de su cabeza escarizada como un escudo o una barrera protectora. Aunque es una unidad de Ataque Ligero, su rol es dar protección a las tropas que avanzan. Al permitir que una unidad amiga pase 'a través' de su posición (como si el Guardián estuviera sellando la retaguardia o desviando el ataque), les confiere una defensa temporal contra los ataques del enemigo.",
        impacto: "Estadísticas de Tanque Ligero: Su PV y DEF son los más altos en la clase Ligera, reflejando la dureza de su cabeza y su rol primario como muro defensivo temporal.",
        imagen: "/unidades/guardian_escamas.png",
    }, {
        id: "centinela_vigilante",
        nombre: "Centinela Vigilante",
        categoria: "Infantería Ligera",
        vida: 45,
        defensa: 40,
        ataque: 68,
        habilidadEspecial: "<b>Ojo de Halcón</b>: Revela las unidades enemigas ocultas en un radio medio.",
        descripcion: "El Centinela Vigilante es la unidad de exploración y reconocimiento, capaz de detectar amenazas que otras unidades pasan por alto. Está formado por las obreras de Formica polyctena, una hormiga muy relacionada con la F. rufa (Avispero Ácido) pero que destaca por su increíble organización y su rol crucial en el ecosistema como depredadora y recolectora.",
        tecnica: "Técnica de Combate: Si bien estas hormigas son agresivas y usan ácido fórmico, su fuerza principal radica en su vigilancia constante de su vasto territorio y montículo. Son expertas en la detección de intrusos y la localización de presas.",
        habilidad: "Se basa en la necesidad biológica de estas grandes colonias de tener una conciencia situacional superior. En el juego, esto se traduce en la capacidad de revelar unidades ocultas o camufladas, una función esencial para contrarrestar emboscadas. Además, su rol real como 'policía sanitaria' (eliminando insectos enfermos) refuerza la idea de que están siempre al tanto de amenazas internas y externas.",
        impacto: "Equilibrio: Sus estadísticas reflejan un luchador ligero pero competente, apto tanto para el ataque como para la exploración.",
        imagen: "/unidades/centinela_vigilante.png",
    }, {
        id: "infiltrado_humedo",
        nombre: "Infiltrado Húmedo",
        categoria: "Infantería Ligera",
        vida: 37,
        defensa: 34,
        ataque: 74,
        habilidadEspecial: "<b>Goteo de Veneno</b>: Deja un rastro tóxico por donde se mueve que daña a las unidades enemigas que lo cruzan.",
        descripcion: "El Infiltrado Húmedo representa el peligro sutil y la persistencia implacable. Basado en la minúscula Monomorium pharaonis, esta unidad es una plaga mundial, conocida por infestar ambientes interiores, particularmente donde hay humedad o alimentos. Su fuerza reside en su capacidad para pasar desapercibida y contaminar.",
        tecnica: "Técnica de Combate: Las hormigas faraón son extremadamente pequeñas y pueden moverse a través de las grietas más minúsculas. Aunque sus picaduras son raras, son conocidas por contaminar alimentos e incluso suministros médicos, sirviendo como vectores de patógenos. Su veneno es de acción lenta pero efectiva.",
        habilidad: "Modela esta contaminación persistente y la capacidad de la hormiga para dejar un rastro de toxinas o suciedad por donde pasa. Al moverse, la unidad no solo se posiciona para el ataque, sino que deja una zona de peligro temporal que castiga a los enemigos por seguir su camino o cruzar su línea de avance. Esto las convierte en una unidad de control de movimiento altamente efectiva.",
        impacto: "Fragilidad vs. Letalidad: Su bajo PV/DEF se compensa con un alto ATQ y la capacidad táctica de su veneno de zona, enfatizando la naturaleza de 'golpear y correr'.",
        imagen: "/unidades/infiltrado_humedo.png",
    }, {
        id: "destructor_cuernos",
        nombre: "Destructor de Cuernos",
        categoria: "Infantería Pesada",
        vida: 85,
        defensa: 70,
        ataque: 60,
        habilidadEspecial: "<b>Blindaje Fúngico</b>: Reduce todo el daño físico recibido en 10.",
        descripcion: "El Destructor de Cuernos es la unidad de vanguardia blindada, el muro que absorbe el castigo. Representa a los soldados mayores (Majors) de las hormigas cortadoras de hojas, uno de los géneros más grandes y robustos del mundo. Su cabeza y mandíbulas son masivas, utilizadas para cortar madera dura y defender las supercolonias.",
        tecnica: "Técnica de Combate: En la naturaleza, las Atta Majors utilizan sus mandíbulas no solo para cortar sino para la defensa, ya que son demasiado grandes para realizar otras tareas. Su exoesqueleto es excepcionalmente grueso.",
        habilidad: "Se inspira en la relación simbiótica única de las cortadoras de hojas con el hongo que cultivan. Recientes investigaciones han demostrado que su exoesqueleto está cubierto por una capa de calcita (un mineral) que lo hace excepcionalmente duro. En el juego, se interpreta como un 'blindaje' adicional cultivado, que les permite reducir una cantidad fija de daño físico en cada golpe, haciendo que los ataques ligeros sean casi inútiles.",
        impacto: "Estadísticas de Tanque: Su altísimo PV y DEF son un testimonio de su resistencia, a pesar de tener un ATQ moderado, reflejando su función principal de absorción de daño. El 'cuerno' del nombre se refiere a las protuberancias espinosas de su tórax, que aumentan su defensa.",
        imagen: "/unidades/destructor_cuernos.png",
    }, {
        id: "maquina_excavadora",
        nombre: "Máquina Excavadora",
        categoria: "Infantería Pesada",
        vida: 78,
        defensa: 55,
        ataque: 75,
        habilidadEspecial: "<b>Asalto Minero</b>: Causa un 50% de daño adicional a estructuras enemigas y unidades estacionarias.",
        descripcion: "La Máquina Excavadora es el especialista en asedio, diseñado para derribar defensas. Se inspira en el género Acanthomyrmex, cuyas obreras mayores poseen mandíbulas con dientes serrados que se cierran como pinzas de fuerza, ideales para cortar material denso y manipular el suelo.",
        tecnica: "Técnica de Combate: Si bien en la naturaleza estas hormigas utilizan sus mandíbulas para manipular objetos, el juego exagera esta capacidad. Su fuerza principal no es la velocidad, sino el poder de palanca y trituración. Utilizan sus potentes mandíbulas para excavar rápidamente y debilitar la base de cualquier estructura.",
        habilidad: "refleja esta fuerza concentrada en la destrucción. La fuerza que usan para excavar o cortar la madera se dirige contra las fortificaciones del enemigo (muros, nidos o caparazones inmóviles). Esto se traduce en un 50% de daño adicional contra cualquier unidad que represente una estructura o defensa fija (como Artillería inmóvil o Tanques).",
        impacto: "Estadísticas de Asedio: Su alto PV y ATQ reflejan su papel como atacante persistente y fuerte, capaz de resistir el fuego defensivo mientras machaca las fortificaciones.",
        imagen: "/unidades/maquina_excavadora.png",
    }, {
        id: "gladiador_cosechador",
        nombre: "Gladiador Cosechador",
        categoria: "Infantería Pesada",
        vida: 80,
        defensa: 60,
        ataque: 65,
        habilidadEspecial: "<b>Voluntad Inquebrantable</b>: Esta unidad no puede ser ralentizada ni inmovilizada.",
        descripcion: "El Gladiador Cosechador es la unidad de choque que asegura la línea frontal, resistiendo los efectos de control de masas enemigos. Se inspira en los soldados mayores (Majors) del género Messor, conocidas por su polimorfismo y sus cabezas desproporcionadamente grandes, diseñadas para triturar y transportar semillas grandes y pesadas.",
        tecnica: "Técnica de Combate: En la naturaleza, las Messor dedican gran parte de su tiempo a transportar cargas que superan con creces su propio peso, a menudo a través de terrenos difíciles y secos. Su anatomía está optimizada para la fuerza pura y la persistencia, no para la velocidad.",
        habilidad: "Modela su obstinada persistencia. Una hormiga capaz de arrastrar una semilla de 10 veces su peso a través del desierto no se detiene por amenazas menores. Esta persistencia se traduce en la inmunidad a todos los efectos de ralentización o inmovilización (como el Alquitrán o el Lodo). El Gladiador Cosechador siempre avanza.",
        impacto: "Equilibrio Robusto: Sus estadísticas altas y equilibradas de PV, ATQ y DEF reflejan una unidad que puede luchar y resistir durante largos períodos de tiempo.",
        imagen: "/unidades/gladiador_cosechador.png",
    }, {
        id: "tormento_fuego",
        nombre: "Tormento de Fuego",
        categoria: "Infantería Pesada",
        vida: 70,
        defensa: 60,
        ataque: 70,
        habilidadEspecial: "<b>Mordida Pirotóxica</b>: Aplica un stack de veneno ardiente. El veneno causa daño prolongado y se acumula hasta 3 veces.",
        descripcion: "El Tormento de Fuego es el soldado pesado más temido por su toxicidad sostenida. Representa a los soldados mayores de Solenopsis invicta, famosas por su picadura extremadamente dolorosa y su capacidad de infestar rápidamente grandes territorios.",
        tecnica: "Técnica de Combate: La sensación de su picadura ha sido comparada con quemaduras, de ahí su nombre común. Esto se debe a que su veneno, la solenopsina, es un alcaloide lipofílico (a base de aceite) que causa pústulas dolorosas y necróticas. A menudo atacan en masa, mordiendo para aferrarse y luego inyectando el veneno repetidamente con el aguijón.",
        habilidad: "modela la naturaleza química y acumulativa de su veneno. No solo causa daño instantáneo, sino que deja un efecto persistente (daño por stack) que 'quema' lentamente a la víctima. Su resistencia (PV y DEF) le permite permanecer en combate el tiempo suficiente para que el veneno haga su trabajo, dándole un rol de control de área y castigo.",
        impacto: "Invasión Masiva: Aunque son unidades pesadas, su presencia constante y su disposición a luchar hasta la muerte las convierten en una fuerza imparable.",
        imagen: "/unidades/tormento_fuego.png",
    }, {
        id: "guardian_mandibula",
        nombre: "Guardián de Mandíbula",
        categoria: "Infantería Pesada",
        vida: 90,
        defensa: 65,
        ataque: 62,
        habilidadEspecial: "<b>Ataque Masivo</b>: Tiene un 40% de probabilidad de aturdir al objetivo durante 1 segundo.",
        descripcion: "El Guardián de Mandíbula es el principal tanque de la legión, cuya presencia y masa física son suficientes para desorganizar la formación enemiga. Se basa en las obreras mayores (Majors) de Camponotus ligniperda, la hormiga más grande de Europa, conocida por su fuerza para excavar madera podrida y sus poderosas mandíbulas.",
        tecnica: "Técnica de Combate: Si bien no son tan agresivas como otras especies, su gran tamaño y la fuerza de su mordida son formidables. En el juego, se enfatiza su capacidad de absorber golpes y devolver el impacto de manera que perturbe el ataque enemigo.",
        habilidad: "Modela el impacto contundente de un cuerpo tan grande y fuerte. Un golpe bien colocado de sus mandíbulas no solo daña, sino que es suficiente para desestabilizar y aturdir a una unidad enemiga, dándole al jugador tiempo valioso para reposicionar o lanzar un ataque de seguimiento.",
        impacto: "Estadísticas de Bloqueo: Su PV es el más alto hasta ahora, y su DEF es excelente, reflejando su rol como la primera línea de defensa que debe aguantar el castigo.",
        imagen: "/unidades/guardian_mandibula.png",
    }, {
        id: "asaltante_arbol",
        nombre: "Asaltante de Árbol",
        categoria: "Infantería Pesada",
        vida: 75,
        defensa: 62,
        ataque: 68,
        habilidadEspecial: "<b>Desembarco Aéreo</b>: Al ser desplegada o reubicada, tiene un 30% de probabilidad de ignorar a las unidades interceptoras.",
        descripcion: "El Asaltante Árbol es el infiltrador de la clase pesada, capaz de sortear obstáculos y defensas gracias a su peculiar movilidad. Se basa en las hormigas del género Cephalotes, que viven en los doseles de los bosques tropicales. Si caen de una rama, no caen sin control; en cambio, pueden planear o deslizarse hacia el tronco del árbol, utilizando sus cuerpos planos y sus patas para controlar la caída.",
        tecnica: "Técnica de Combate: Esta habilidad aérea las hace expertas en la llegada y el ataque inesperados. Pueden saltar o dejarse caer sobre un enemigo desde una posición elevada sin ser detectadas.",
        habilidad: "Modela esta capacidad de maniobra durante el descenso o movimiento rápido. Les permite entrar en combate sorteando los 'bloqueos' (unidades interceptoras) que normalmente detendrían a una unidad pesada. Esto le da una ventaja táctica significativa para golpear flancos inesperados. Su cuerpo aplanado y robusto también les da un buen PV/DEF para soportar el aterrizaje y el combate inicial.",
        impacto: "Mandíbulas de Sierra: Su ATQ es sólido, ya que su cabeza, además de ser plana (útil para el planeo y la defensa), también está equipada con fuertes mandíbulas.",
        imagen: "/unidades/asaltante_arbol.png",
    }, {
        id: "golpeador_roca",
        nombre: "Golpeador de Roca",
        categoria: "Infantería Pesada",
        vida: 72,
        defensa: 50,
        ataque: 80,
        habilidadEspecial: "<b>Picadura de Choque</b>: El daño crítico de esta unidad inflige un efecto de Envenenamiento severo (alto daño por turno).",
        descripcion: "El Golpeador de Roca es un soldado de choque que infunde terror con su fuerza y veneno. Basado en las robustas Pogonomyrmex, estas hormigas son conocidas por sus picaduras increíblemente dolorosas (comparables a la Hormiga Bala y el Tormento de Fuego), y por construir grandes montículos en terrenos duros.",
        tecnica: "Técnica de Combate: Su estrategia de combate combina una mordida poderosa con una picadura de veneno altamente potente y neurotóxico. Su gran tamaño y la construcción de nidos que involucran mover pequeñas rocas justifican el nombre de 'Golpeador de Roca'.",
        habilidad: "Combina su fuerza ofensiva (alto ATQ) con su toxicidad. Un golpe que ya es efectivo (crítico) se convierte en una sentencia de muerte al activar un veneno particularmente virulento. Esto recompensa al jugador por buscar el kill shot, asegurando que, incluso si el objetivo sobrevive al golpe, la toxina lo eliminará rápidamente.",
        impacto: "Agresividad y Resistencia: Sus estadísticas reflejan una unidad más ofensiva que el Destructor de Cuernos, diseñada para infligir daño letal en la primera línea.",
        imagen: "/unidades/golpeador_roca.png",
    }, {
        id: "moldeador_barro",
        nombre: "Moldeador de Barro",
        categoria: "Infantería Pesada",
        vida: 82,
        defensa: 68,
        ataque: 55,
        habilidadEspecial: "<b>Muro Temporal</b>: Al permanecer inmóvil por 1 turno, la unidad gana 10 de Defensa adicional. Este efecto se acumula hasta 3 veces.",
        descripcion: "El Moldeador de Barro es el defensor estático del frente pesado, capaz de convertir el campo de batalla en una fortaleza temporal. Se basa en el género Crematogaster, cuyas especies a menudo construyen nidos cartoneros o de barro adheridos a árboles y estructuras. Son conocidas por su abdomen en forma de corazón que elevan cuando están alarmadas, y por secretar sustancias pegajosas.",
        tecnica: "Técnica de Combate: Su estrategia principal es la defensa posicional. Utilizan material circundante (barro, detritos) mezclado con sus secreciones para reforzar rápidamente su posición y construir barreras improvisadas.",
        habilidad: "Modela esta capacidad de fortificación. Al dedicar un turno a 'moldear' y reforzar su posición (permanecer inmóvil), el Moldeador de Barro gana un aumento acumulativo en la defensa, convirtiéndose en un verdadero bastión o muro móvil. Esto la convierte en la unidad ideal para mantener un punto de control.",
        impacto: "Estadísticas Defensivas: Su bajo ATQ se compensa con un PV muy alto y la capacidad de aumentar significativamente su DEF, confirmando su rol como tanque y constructor defensivo.",
        imagen: "/unidades/moldeador_barro.png",
    }, {
        id: "torreon_azucarero",
        nombre: "Torreón Azucarero",
        categoria: "Infantería Pesada",
        vida: 95,
        defensa: 60,
        ataque: 50,
        habilidadEspecial: "<b>Sustento Sacrificial</b>: Al ser destruida, sana a todas las unidades amigas adyacentes en un 25% de su PV máximo.",
        descripcion: "El Torreón Azucarero es la unidad de soporte definitiva en el frente pesado. Se basa en las Hormigas Melíferas (honeypot ants), cuyas obreras se hinchan hasta convertirse en esferas vivientes llenas de néctar y secreciones azucaradas, actuando como despensas de comida de emergencia para la colonia en tiempos de escasez.",
        tecnica: "Técnica de Combate: Estas obreras están tan hinchadas de 'miel' que son casi inmóviles. Aunque no son guerreros activos, su valor radica en lo que llevan dentro. Su defensa es alta por la tensión de su abdomen inflado, pero si son atacadas, el impacto es catastrófico, liberando su contenido.",
        habilidad: "Modela este rol de reserva de emergencia. Su destrucción, si se ejecuta tácticamente cerca de unidades aliadas, libera la energía almacenada (el néctar) que cura instantáneamente a los aliados circundantes. Su PV es el más alto de todos, forzando al enemigo a invertir mucho daño para obtener la curación para el equipo contrario.",
        impacto: "Estadísticas Defensivas: Su bajo ATQ se compensa con un PV muy alto y la capacidad de aumentar significativamente su DEF, confirmando su rol como tanque y constructor defensivo.",
        imagen: "/unidades/torreon_azucarero.png",
    }, {
        id: "muralla_ebano",
        nombre: "Muralla de Ébano",
        categoria: "Infantería Pesada",
        vida: 88,
        defensa: 75,
        ataque: 78,
        habilidadEspecial: "Largo Castigo: Sus ataques infligen Terror, lo que reduce el Ataque de las unidades enemigas adyacentes en un 15% durante 2 turnos.",
        descripcion: "La Muralla de Ébano es la unidad de choque definitiva, combinando una resistencia temible con un veneno que paraliza la voluntad de lucha. Basada en la Paraponera clavata, la Hormiga Bala es la hormiga más grande del Neotrópico y su picadura es la más dolorosa conocida en el mundo (clasificación 4.0 en el Índice Schmidt), descrita como comparable a recibir un disparo.",
        tecnica: "Técnica de Combate: Son cazadores solitarios o pequeños grupos, pero su fuerza individual es inmensa. Su gran tamaño, su exoesqueleto duro y su veneno potente (la poneratoxina, que afecta al sistema nervioso) las hacen temibles.",
        habilidad: "Se inspira directamente en el dolor y la parálisis neural causados por su picadura. El 'Terror' que inflige no solo es conceptual, sino que disminuye la efectividad ofensiva de los enemigos cercanos, ya que están demasiado abrumados por el dolor y el miedo para atacar con toda su fuerza. Su altísimo PV/DEF y ATQ reflejan su estatus como el Tanque Supremo y la unidad de control más peligrosa de la clase pesada.",
        impacto: "Color Ébano: Su nombre refleja su color negro brillante y su rol de muralla impenetrable.",
        imagen: "/unidades/muralla_ebano.png",
    }
]

const categorias = ["Infantería Ligera", "Infantería Pesada", "Artillería", "Especializada"]

const coloresPorCategoria: { [key: string]: string } = {
    "Infantería Ligera": "bg-blue-500/20 border-blue-500/50 text-blue-300",
    "Infantería Pesada": "bg-red-500/20 border-red-500/50 text-red-300",
    Artillería: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    Especializada: "bg-purple-500/20 border-purple-500/50 text-purple-300",
}

export default function UnidadesPage() {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)

    const unidadesFiltradas = categoriaSeleccionada
        ? unidades.filter((u) => u.categoria === categoriaSeleccionada)
        : unidades

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/wiki">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold text-foreground">Unidades de Nidoria</h1>
                        <p className="text-muted-foreground mt-2">Conoce todos los tipos de hormigas soldado</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Categorías</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaSeleccionada(categoriaSeleccionada === cat ? null : cat)}
                                className={`p-3 rounded-xl text-center text-sm font-medium transtion-all ${categoriaSeleccionada === cat
                                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                                    : "bg-card border border-border text-muted-foreground hover:border-primary/50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Units Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {unidadesFiltradas.map((unidad) => (
                        <div
                            key={unidad.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                        >
                            {/* Unit Image */}
                            <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                                <img
                                    src={unidad.imagen}
                                    alt={unidad.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Unit Info */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground">{unidad.nombre}</h3>
                                        <p className="text-sm text-primary font-medium">{unidad.categoria}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${coloresPorCategoria[unidad.categoria]}`}
                                    >
                                        {unidad.categoria}
                                    </span>
                                </div>

                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.descripcion}</p>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.tecnica}</p>
                                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{unidad.impacto}</p>

                                {/* Stats */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Vida</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.vida}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Defensa</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.defensa}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Ataque</div>
                                        <div className="text-lg font-bold text-foreground">{unidad.ataque}</div>
                                    </div>
                                    <div className="bg-accent/10 rounded-xl p-3 text-center">
                                        <div className="text-xs text-muted-foreground mb-1">Velocidad</div>
                                        <div className="text-lg font-bold text-foreground">15</div>
                                    </div>
                                </div>

                                {/* Special Ability */}
                                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                                    <h4 className="font-bold text-primary mb-2 text-sm">Habilidad Especial</h4>
                                    <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: unidad.habilidadEspecial }}></p>
                                    <p className="text-sm text-muted-foreground">{unidad.habilidad}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}