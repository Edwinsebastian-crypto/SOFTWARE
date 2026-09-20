/* =========================================================================
   usuarios.js — Módulo "Gestionar Usuarios" del panel de Director.
   Se carga DESPUÉS de shell.js y director.js. Todo vive dentro de una IIFE
   para no chocar con las variables/funciones de director.js.

   Contiene:
     · Pestañas Registrar / Listar
     · Asistente de registro en 4 pasos con validación por paso
     · Tarjeta de credencial que se actualiza en vivo
     · Listado con búsqueda, filtros, selección en lote y paginación
   ========================================================================= */

(function () {
   'use strict';

   const root = document.getElementById('gestionar-usuarios');
   if (!root) return;

   /* ----------------------------------------------------------------------
      Catálogos del sistema (coinciden con los roles del login del SPP)
      ---------------------------------------------------------------------- */
   const ROLES = {
      estudiante: { nombre: 'Estudiante', icono: 'fa-graduation-cap', clase: '' },
      tutor: { nombre: 'Tutor Académico', icono: 'fa-user', clase: 'gu-pill--tutor' },
      asesor: { nombre: 'Asesor Pedagógico', icono: 'fa-user-group', clase: 'gu-pill--asesor' },
      director: { nombre: 'Director', icono: 'fa-briefcase', clase: 'gu-pill--director' }
   };

   const ESTADOS = {
      activo: 'Activo',
      pendiente: 'Pendiente',
      inactivo: 'Inactivo'
   };

   const DOMINIO = '@universidad.edu.co';

   /* ----------------------------------------------------------------------
      Datos de ejemplo
      ---------------------------------------------------------------------- */
   let usuarios = [
      crearUsuario('Mariana Sofía', 'Cárdenas Mendoza', 'CC', '1098234871', 'estudiante', 'Licenciatura en Pedagogía Infantil', 'activo', 'm.cardenas', 'Hace 15 min'),
      crearUsuario('Ramiro Jesús', 'Urtado Bueno', 'CC', '79845102', 'tutor', 'Facultad de Educación y Humanidades', 'activo', 'r.urtado', 'Hoy, 09:30 a. m.'),
      crearUsuario('Claudia Patricia', 'Rueda Pardo', 'CC', '52341890', 'asesor', 'Escuela Normal Superior de Bucaramanga', 'activo', 'c.rueda', 'Ayer, 04:12 p. m.'),
      crearUsuario('Carlos Eduardo', 'Peña Vivas', 'TI', '1014982410', 'estudiante', 'Licenciatura en Educación Física', 'pendiente', 'c.pena', 'Nunca'),
      crearUsuario('Valentina', 'Ortiz Bernal', 'CC', '1032489112', 'director', 'Dirección de Prácticas Pedagógicas', 'activo', 'val.ortiz', 'Hoy, 08:10 a. m.'),
      crearUsuario('Juan Carlos', 'Ramírez Silva', 'CC', '80123490', 'tutor', 'Facultad de Educación y Humanidades', 'activo', 'jc.ramirez', '14 feb, 06:45 p. m.'),
      crearUsuario('Laura Marcela', 'Rincón Duarte', 'CC', '1020812903', 'estudiante', 'Licenciatura en Lenguas Modernas', 'inactivo', 'laura.rincon', '02 dic, 2025')
   ];

   let secuencia = usuarios.length;

   function crearUsuario(nombres, apellidos, docTipo, docNumero, rol, programa, estado, correo, ultimoAcceso) {
      return {
         id: 'u' + Math.random().toString(36).slice(2, 9),
         nombres, apellidos, docTipo, docNumero, rol, programa, estado,
         correo: correo + DOMINIO,
         pass: 'Practicas2026*!',
         ultimoAcceso: ultimoAcceso || 'Nunca'
      };
   }

   /* ----------------------------------------------------------------------
      Utilidades
      ---------------------------------------------------------------------- */
   const $ = (sel) => root.querySelector(sel);
   const $$ = (sel) => Array.from(root.querySelectorAll(sel));

   function escapar(texto) {
      const div = document.createElement('div');
      div.textContent = texto == null ? '' : String(texto);
      return div.innerHTML;
   }

   function iniciales(u) {
      const a = (u.nombres || '').trim().charAt(0);
      const b = (u.apellidos || '').trim().charAt(0);
      return (a + b).toUpperCase() || '··';
   }

   function nombreCompleto(u) {
      return (u.nombres + ' ' + u.apellidos).trim();
   }

   function sinTildes(texto) {
      return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
   }

   /* ======================================================================
      1. PESTAÑAS
      ====================================================================== */
   const tabs = $$('.gu-tab-btn');
   tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
         const destino = btn.getAttribute('data-gu-panel');
         tabs.forEach((b) => b.classList.toggle('active', b === btn));
         $$('.gu-panel').forEach((p) => {
            p.style.display = p.id === destino ? '' : 'none';
         });
      });
   });

   function abrirPestana(id) {
      const btn = root.querySelector('.gu-tab-btn[data-gu-panel="' + id + '"]');
      if (btn) btn.click();
   }

   /* ======================================================================
      2. ASISTENTE DE REGISTRO
      ====================================================================== */
   const layout = $('.gu-wizard-layout');
   const pasos = $$('.gu-step-panel');
   const itemsPaso = $$('.gu-step-item');
   const barrasPaso = $$('.gu-step-bar');
   const btnPrev = $('#gu-btn-prev');
   const btnNext = $('#gu-btn-next');
   const btnSubmit = $('#gu-btn-submit');
   const btnLimpiar = $('#gu-btn-reset');
   const textoProgreso = $('#gu-progress-text');
   const preview = $('#gu-preview-card');
   const form = $('#gu-form');

   const TOTAL_PASOS = pasos.length;
   let pasoActual = 1;
   let editandoId = null;
   let passVisible = false;

   const campos = {
      docTipo: $('#gu-doc-tipo'),
      docNumero: $('#gu-doc-numero'),
      nombres: $('#gu-nombres'),
      apellidos: $('#gu-apellidos'),
      programa: $('#gu-programa'),
      facultad: $('#gu-facultad'),
      correo: $('#gu-correo'),
      pass: $('#gu-pass'),
      notificar: $('#gu-notificar')
   };

   let estadoCuenta = 'activo';

   /* --- Lectura del formulario --- */
   function datosFormulario() {
      const rolInput = root.querySelector('input[name="gu-rol"]:checked');
      const usuarioCorreo = (campos.correo.value || '').trim();
      return {
         nombres: campos.nombres.value.trim(),
         apellidos: campos.apellidos.value.trim(),
         docTipo: campos.docTipo.value,
         docNumero: campos.docNumero.value.trim(),
         rol: rolInput ? rolInput.value : 'estudiante',
         programa: campos.programa.value,
         estado: estadoCuenta,
         correo: usuarioCorreo ? usuarioCorreo + DOMINIO : '',
         pass: campos.pass.value
      };
   }

   /* --- Tarjeta de credencial (misma plantilla para vista previa y detalle) --- */
   function plantillaCredencial(u, verPass) {
      const rol = ROLES[u.rol] || ROLES.estudiante;
      const nombre = nombreCompleto(u) || 'Nombre del usuario';
      const doc = (u.docTipo || 'CC') + '  •  ' + (u.docNumero || '—');
      const estado = (u.estado || 'activo');
      const anio = new Date().getFullYear();
      const pass = u.pass || '';
      const passTexto = verPass ? pass : '•'.repeat(Math.max(pass.length, 8));

      return '' +
         '<article class="gu-cred">' +
         '  <header class="gu-cred-top">' +
         '    <div class="gu-cred-brand">' +
         '      <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>' +
         '      <p>Credencial<br>universitaria <em>' + anio + '</em></p>' +
         '    </div>' +
         '    <span class="gu-cred-state gu-cred-state--' + estado + '">' + escapar(ESTADOS[estado] || 'Activo').toUpperCase() + '</span>' +
         '  </header>' +
         '  <button type="button" class="gu-cred-cta" data-gu-bitacora>Ver bitácora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>' +
         '  <div class="gu-cred-body">' +
         '    <h3 class="gu-cred-name">' + escapar(nombre) + '</h3>' +
         '    <p class="gu-cred-doc">' + escapar(doc) + '</p>' +
         '    <span class="gu-cred-role"><i class="fa-solid ' + rol.icono + '" aria-hidden="true"></i>' + escapar(rol.nombre) + '</span>' +
         '    <dl class="gu-cred-meta">' +
         '      <div><dt>Programa académico</dt><dd>' + escapar(u.programa || 'Sin asignar') + '</dd></div>' +
         '      <div><dt>Correo asignado</dt><dd class="is-mono">' + escapar(u.correo || 'usuario' + DOMINIO) + '</dd></div>' +
         '      <div><dt>Contraseña</dt>' +
         '        <dd class="gu-cred-pass">' +
         '          <output>' + escapar(passTexto) + '</output>' +
         '          <button type="button" data-gu-verpass aria-label="' + (verPass ? 'Ocultar' : 'Mostrar') + ' contraseña">' +
         '            <i class="fa-regular ' + (verPass ? 'fa-eye' : 'fa-eye-slash') + '" aria-hidden="true"></i>' +
         '          </button>' +
         '        </dd>' +
         '      </div>' +
         '    </dl>' +
         '  </div>' +
         '</article>';
   }

   function pintarPrevia() {
      preview.innerHTML = plantillaCredencial(datosFormulario(), passVisible);
   }

   /* --- Programa → facultad --- */
   function sincronizarFacultad() {
      const opcion = campos.programa.options[campos.programa.selectedIndex];
      campos.facultad.value = opcion ? (opcion.getAttribute('data-facultad') || '') : '';
   }

   function sincronizarSelectPersonalizado(select) {
      if (!select) return;
      const wrap = select.closest('.cp-input-wrap');
      const trigger = wrap ? wrap.querySelector('.custom-select-trigger') : null;
      const opcion = select.options[select.selectedIndex];
      if (!trigger || !opcion) return;
      trigger.textContent = opcion.text;
      trigger.classList.toggle('is-placeholder', !!opcion.disabled);
   }

   /* --- Correo sugerido a partir del nombre --- */
   let correoEditadoAMano = false;
   campos.correo.addEventListener('input', () => { correoEditadoAMano = true; });

   function sugerirCorreo() {
      if (correoEditadoAMano) return;
      const n = sinTildes(campos.nombres.value.trim().split(/\s+/)[0] || '');
      const a = sinTildes(campos.apellidos.value.trim().split(/\s+/)[0] || '');
      if (!n && !a) return;
      campos.correo.value = (n ? n.charAt(0) + '.' : '') + a;
   }

   /* --- Validación por paso --- */
   function marcarError(input, mensaje) {
      const campo = input.closest('.gu-field');
      if (!campo) return;
      const caja = campo.querySelector('.gu-error');
      if (mensaje) {
         campo.classList.add('has-error');
         if (caja) caja.textContent = mensaje;
      } else {
         campo.classList.remove('has-error');
      }
   }

   function validarPaso(n) {
      let ok = true;
      const falla = (input, mensaje) => { marcarError(input, mensaje); if (ok) input.focus(); ok = false; };

      if (n === 1) {
         marcarError(campos.nombres, ''); marcarError(campos.apellidos, ''); marcarError(campos.docNumero, '');
         if (!/^\d{6,15}$/.test(campos.docNumero.value.trim())) falla(campos.docNumero, 'Escribe el número de documento (solo dígitos, mínimo 6).');
         if (campos.apellidos.value.trim().length < 2) falla(campos.apellidos, 'Escribe los apellidos completos.');
         if (campos.nombres.value.trim().length < 2) falla(campos.nombres, 'Escribe los nombres del usuario.');
         const repetido = usuarios.find((u) => u.docNumero === campos.docNumero.value.trim() && u.id !== editandoId);
         if (repetido) falla(campos.docNumero, 'Ya existe un usuario con este documento.');
      }

      if (n === 2) {
         marcarError(campos.programa, '');
         if (!campos.programa.value) falla(campos.programa, 'Selecciona el programa o la dependencia.');
      }

      if (n === 3) {
         marcarError(campos.correo, ''); marcarError(campos.pass, '');
         if (campos.pass.value.length < 8) falla(campos.pass, 'La contraseña necesita al menos 8 caracteres.');
         if (!/^[a-z0-9]+([._-][a-z0-9]+)*$/i.test(campos.correo.value.trim())) falla(campos.correo, 'Usa letras, números, punto, guion o guion bajo.');
         const correoRepetido = usuarios.find((u) => u.correo === campos.correo.value.trim() + DOMINIO && u.id !== editandoId);
         if (correoRepetido) falla(campos.correo, 'Este correo institucional ya está asignado.');
      }

      return ok;
   }

   /* --- Navegación entre pasos --- */
   function mostrarPaso(n) {
      pasoActual = Math.min(Math.max(n, 1), TOTAL_PASOS);
      layout.setAttribute('data-step', String(pasoActual));

      pasos.forEach((p, i) => p.classList.toggle('is-active', i === pasoActual - 1));

      itemsPaso.forEach((item, i) => {
         item.classList.toggle('is-current', i === pasoActual - 1);
         item.classList.toggle('is-done', i < pasoActual - 1);
         item.setAttribute('aria-current', i === pasoActual - 1 ? 'step' : 'false');
      });
      barrasPaso.forEach((b, i) => b.classList.toggle('is-done', i < pasoActual - 1));

      btnPrev.style.display = pasoActual === 1 ? 'none' : '';
      btnNext.style.display = pasoActual === TOTAL_PASOS ? 'none' : '';
      btnSubmit.style.display = pasoActual === TOTAL_PASOS ? '' : 'none';
      textoProgreso.textContent = 'Paso ' + pasoActual + ' de ' + TOTAL_PASOS;

      if (pasoActual === TOTAL_PASOS) pintarResumen();
      pintarPrevia();

      const wrapper = root.querySelector('.practice-content-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
      const shell = document.querySelector('.app-shell');
      if (shell) shell.scrollTop = 0;
      window.scrollTo(0, 0);
   }

   function pintarResumen() {
      const d = datosFormulario();
      const rol = ROLES[d.rol];
      const resumen = $('#gu-summary');
      const filas = [
         ['Nombre completo', nombreCompleto(d)],
         ['Documento', d.docTipo + ' ' + d.docNumero],
         ['Rol institucional', rol.nombre],
         ['Programa / dependencia', d.programa],
         ['Facultad', campos.facultad.value || '—'],
         ['Correo institucional', d.correo],
         ['Estado inicial', ESTADOS[d.estado]],
         ['Envío de credenciales', campos.notificar.checked ? 'Por correo, al guardar' : 'Entrega manual']
      ];
      resumen.innerHTML = filas.map((f) =>
         '<div><dt>' + escapar(f[0]) + '</dt><dd>' + escapar(f[1] || '—') + '</dd></div>'
      ).join('');

      $$('#gu-checklist li').forEach((li) => {
         const clave = li.getAttribute('data-req');
         let listo = false;
         if (clave === 'identidad') listo = !!(d.nombres && d.apellidos && d.docNumero);
         if (clave === 'rol') listo = !!d.programa;
         if (clave === 'correo') listo = !!campos.correo.value.trim();
         if (clave === 'clave') listo = d.pass.length >= 8;
         li.classList.toggle('is-ok', listo);
         const icono = li.querySelector('i');
         if (icono) {
            icono.classList.toggle('fa-circle-check', listo);
            icono.classList.toggle('fa-circle', !listo);
         }
      });
   }

   btnNext.addEventListener('click', () => {
      if (!validarPaso(pasoActual)) return;
      if (pasoActual === 1) sugerirCorreo();
      mostrarPaso(pasoActual + 1);
   });

   btnPrev.addEventListener('click', () => mostrarPaso(pasoActual - 1));

   itemsPaso.forEach((item, i) => {
      item.addEventListener('click', () => {
         const destino = i + 1;
         if (destino <= pasoActual) return mostrarPaso(destino);
         for (let p = pasoActual; p < destino; p++) {
            if (!validarPaso(p)) return mostrarPaso(p);
         }
         mostrarPaso(destino);
      });
   });

   /* --- Entradas que refrescan la tarjeta --- */
   ['input', 'change'].forEach((evento) => {
      form.addEventListener(evento, (e) => {
         if (e.target === campos.docNumero) {
            campos.docNumero.value = campos.docNumero.value.replace(/\D/g, '');
         }
         if (e.target === campos.programa) sincronizarFacultad();
         if (e.target === campos.pass) medirClave(campos.pass.value);
         if (e.target.name === 'gu-rol') ajustarProgramaPorRol(e.target.value);
         pintarPrevia();
         if (pasoActual === TOTAL_PASOS) pintarResumen();
      });
   });

   function ajustarProgramaPorRol(rol) {
      const etiqueta = $('#gu-programa-label');
      etiqueta.textContent = rol === 'estudiante' ? 'Programa académico' : 'Dependencia o adscripción';
   }

   /* --- Contraseña --- */
   const barras = $$('#gu-strength span');
   const textoClave = $('#gu-strength-text');

   function medirClave(valor) {
      let nivel = 0;
      if (valor.length >= 8) nivel++;
      if (/[A-Z]/.test(valor) && /[a-z]/.test(valor) && /\d/.test(valor)) nivel++;
      if (valor.length >= 12 && /[^A-Za-z0-9]/.test(valor)) nivel++;

      const colores = ['#b93232', '#dda326', '#1a6b50'];
      const textos = ['Débil: usa 8 caracteres o más', 'Media: agrega mayúsculas y números', 'Fuerte: lista para entregar'];

      barras.forEach((b, i) => {
         b.style.background = i < nivel ? colores[Math.max(nivel - 1, 0)] : '';
      });
      textoClave.textContent = valor.length === 0 ? 'Sin definir' : textos[Math.max(nivel - 1, 0)];
      textoClave.style.color = valor.length === 0 ? '' : colores[Math.max(nivel - 1, 0)];
   }

   $('#gu-pass-toggle').addEventListener('click', function () {
      const visible = campos.pass.type === 'text';
      campos.pass.type = visible ? 'password' : 'text';
      const icono = this.querySelector('i');
      icono.classList.toggle('fa-eye', visible);
      icono.classList.toggle('fa-eye-slash', !visible);
   });

   $('#gu-pass-generar').addEventListener('click', () => {
      const letras = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
      const numeros = '23456789';
      const simbolos = '!@#$%*';
      let clave = '';
      for (let i = 0; i < 10; i++) clave += letras.charAt(Math.floor(Math.random() * letras.length));
      for (let i = 0; i < 3; i++) clave += numeros.charAt(Math.floor(Math.random() * numeros.length));
      clave += simbolos.charAt(Math.floor(Math.random() * simbolos.length));
      campos.pass.value = clave;
      medirClave(clave);
      marcarError(campos.pass, '');
      pintarPrevia();
   });

   /* --- Estado de la cuenta --- */
   $$('.gu-switch button').forEach((btn) => {
      btn.addEventListener('click', () => {
         estadoCuenta = btn.getAttribute('data-estado');
         $$('.gu-switch button').forEach((b) => b.classList.toggle('is-on', b === btn));
         $('#gu-estado-desc').textContent = {
            activo: 'El usuario entra al portal apenas reciba sus credenciales.',
            pendiente: 'El usuario debe activar la cuenta desde el correo antes de entrar.',
            inactivo: 'La cuenta queda creada pero sin acceso al portal.'
         }[estadoCuenta];
         pintarPrevia();
         if (pasoActual === TOTAL_PASOS) pintarResumen();
      });
   });

   /* --- Limpiar / guardar --- */
   function limpiarFormulario() {
      form.reset();
      editandoId = null;
      correoEditadoAMano = false;
      estadoCuenta = 'activo';
      $$('.gu-switch button').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-estado') === 'activo'));
      $('#gu-estado-desc').textContent = 'El usuario entra al portal apenas reciba sus credenciales.';
      $$('.gu-field').forEach((f) => f.classList.remove('has-error'));
      $('#gu-form-title').textContent = 'Registrar nuevo usuario';
      $('#gu-form-desc').textContent = 'Completa los cuatro pasos para dar de alta al usuario en el sistema institucional.';
      btnSubmit.innerHTML = '<i class="fa-solid fa-user-check" aria-hidden="true"></i> Registrar y activar';
      sincronizarFacultad();
      sincronizarSelectPersonalizado(campos.docTipo);
      sincronizarSelectPersonalizado(campos.programa);
      ajustarProgramaPorRol('estudiante');
      medirClave(campos.pass.value);
      mostrarPaso(1);
   }

   btnLimpiar.addEventListener('click', limpiarFormulario);

   form.addEventListener('submit', (e) => {
      e.preventDefault();
      for (let p = 1; p <= 3; p++) {
         if (!validarPaso(p)) return mostrarPaso(p);
      }
      const d = datosFormulario();

      if (editandoId) {
         const idx = usuarios.findIndex((u) => u.id === editandoId);
         if (idx > -1) usuarios[idx] = Object.assign({}, usuarios[idx], d);
         avisar('Usuario actualizado', 'Usuario actualizado exitosamente');
      } else {
         secuencia++;
         usuarios.unshift(Object.assign({ id: 'u' + secuencia + Date.now().toString(36), ultimoAcceso: 'Nunca' }, d));
         avisar('Usuario registrado', 'Usuario registrado exitosamente');
      }

      limpiarFormulario();
      pintarListado();
   });

   /* ======================================================================
      3. LISTADO
      ====================================================================== */
   const tbody = $('#gu-tbody');
   const contenedorTarjetas = $('#gu-cards');
   const inputBuscar = $('#gu-search');
   const filtroRol = $('#gu-filter-rol');
   const filtroEstado = $('#gu-filter-estado');
   const selectFilas = $('#gu-rows');
   const seleccion = new Set();
   let pagina = 1;

   function filtrados() {
      const q = sinTildes(inputBuscar.value.trim());
      return usuarios.filter((u) => {
         if (filtroRol.value && u.rol !== filtroRol.value) return false;
         if (filtroEstado.value && u.estado !== filtroEstado.value) return false;
         if (!q) return true;
         return sinTildes(nombreCompleto(u) + ' ' + u.docNumero + ' ' + u.correo).includes(q);
      });
   }

   function filaHTML(u) {
      const rol = ROLES[u.rol];
      const marcado = seleccion.has(u.id) ? ' checked' : '';
      return '<tr data-id="' + u.id + '">' +
         '<td class="gu-col-check"><input type="checkbox" class="gu-check-row" data-id="' + u.id + '" aria-label="Seleccionar ' + escapar(nombreCompleto(u)) + '"' + marcado + '></td>' +
         '<td><div class="gu-user-cell"><span class="gu-avatar" aria-hidden="true">' + escapar(iniciales(u)) + '</span>' +
         '<div><strong>' + escapar(nombreCompleto(u)) + '</strong><small>' + escapar(u.correo) + '</small></div></div></td>' +
         '<td class="gu-doc">' + escapar(u.docTipo + ' ' + u.docNumero) + '</td>' +
         '<td><span class="gu-pill ' + rol.clase + '"><i class="fa-solid ' + rol.icono + '" aria-hidden="true"></i>' + escapar(rol.nombre) + '</span></td>' +
         '<td><div class="gu-dep"><strong>' + escapar(u.programa) + '</strong></div></td>' +
         '<td><span class="gu-state gu-state--' + u.estado + '">' + escapar(ESTADOS[u.estado]) + '</span></td>' +
         '<td class="gu-last">' + escapar(u.ultimoAcceso) + '</td>' +
         '<td class="gu-col-actions"><div class="gu-row-actions">' +
         '<button type="button" data-act="ver" data-id="' + u.id + '" title="Ver credencial" aria-label="Ver credencial"><i class="fa-solid fa-id-card" aria-hidden="true"></i></button>' +
         '<button type="button" data-act="editar" data-id="' + u.id + '" title="Editar usuario" aria-label="Editar usuario"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button>' +
         '<button type="button" data-act="eliminar" data-id="' + u.id + '" title="Eliminar usuario" aria-label="Eliminar usuario"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>' +
         '</div></td>' +
         '</tr>';
   }

   function tarjetaHTML(u) {
      const rol = ROLES[u.rol];
      const marcado = seleccion.has(u.id) ? ' checked' : '';
      return '<article class="gu-user-card" data-id="' + u.id + '">' +
         '<div class="gu-user-card-top">' +
         '<input type="checkbox" class="gu-check-row" data-id="' + u.id + '" aria-label="Seleccionar ' + escapar(nombreCompleto(u)) + '"' + marcado + '>' +
         '<div class="gu-user-cell"><span class="gu-avatar" aria-hidden="true">' + escapar(iniciales(u)) + '</span>' +
         '<div><strong>' + escapar(nombreCompleto(u)) + '</strong><small>' + escapar(u.correo) + '</small></div></div></div>' +
         '<div class="gu-user-card-meta">' +
         '<span class="gu-pill ' + rol.clase + '"><i class="fa-solid ' + rol.icono + '" aria-hidden="true"></i>' + escapar(rol.nombre) + '</span>' +
         '<span class="gu-state gu-state--' + u.estado + '">' + escapar(ESTADOS[u.estado]) + '</span>' +
         '</div>' +
         '<dl>' +
         '<div><dt>Documento:</dt><dd>' + escapar(u.docTipo + ' ' + u.docNumero) + '</dd></div>' +
         '<div><dt>Programa:</dt><dd>' + escapar(u.programa) + '</dd></div>' +
         '<div><dt>Último acceso:</dt><dd>' + escapar(u.ultimoAcceso) + '</dd></div>' +
         '</dl>' +
         '<div class="gu-row-actions">' +
         '<button type="button" data-act="ver" data-id="' + u.id + '" aria-label="Ver credencial"><i class="fa-solid fa-id-card" aria-hidden="true"></i></button>' +
         '<button type="button" data-act="editar" data-id="' + u.id + '" aria-label="Editar usuario"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button>' +
         '<button type="button" data-act="eliminar" data-id="' + u.id + '" aria-label="Eliminar usuario"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>' +
         '</div></article>';
   }

   function pintarListado() {
      const lista = filtrados();
      const porPagina = parseInt(selectFilas.value, 10) || 10;
      const totalPaginas = Math.max(Math.ceil(lista.length / porPagina), 1);
      pagina = Math.min(pagina, totalPaginas);

      const inicio = (pagina - 1) * porPagina;
      const visibles = lista.slice(inicio, inicio + porPagina);

      if (visibles.length === 0) {
         const vacio = '<div class="gu-empty"><i class="fa-solid fa-user-slash" aria-hidden="true"></i>' +
            '<strong>Ningún usuario coincide con la búsqueda</strong>' +
            '<span>Cambia los filtros o registra un usuario nuevo desde la primera pestaña.</span></div>';
         tbody.innerHTML = '<tr><td colspan="8">' + vacio + '</td></tr>';
         contenedorTarjetas.innerHTML = vacio;
      } else {
         tbody.innerHTML = visibles.map(filaHTML).join('');
         contenedorTarjetas.innerHTML = visibles.map(tarjetaHTML).join('');
      }

      $('#gu-range').innerHTML = lista.length === 0
         ? 'Sin resultados'
         : 'Mostrando <b>' + (inicio + 1) + '–' + (inicio + visibles.length) + '</b> de <b>' + lista.length + '</b> usuarios';

      pintarPaginas(totalPaginas);
      pintarKpis();
      actualizarSeleccion();
   }

   function pintarPaginas(total) {
      const cajaPaginas = $('#gu-pages');
      let html = '<button type="button" data-page="prev" aria-label="Página anterior"' + (pagina === 1 ? ' disabled' : '') + '><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>';
      const desde = Math.max(1, Math.min(pagina - 2, total - 4));
      const hasta = Math.min(total, Math.max(pagina + 2, 5));
      for (let p = desde; p <= hasta; p++) {
         html += '<button type="button" data-page="' + p + '"' + (p === pagina ? ' class="is-current" aria-current="page"' : '') + '>' + p + '</button>';
      }
      html += '<button type="button" data-page="next" aria-label="Página siguiente"' + (pagina === total ? ' disabled' : '') + '><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>';
      cajaPaginas.innerHTML = html;
   }

   function pintarKpis() {
      const cuenta = (fn) => usuarios.filter(fn).length;
      const total = usuarios.length || 1;
      const datos = [
         ['estudiantes', cuenta((u) => u.rol === 'estudiante')],
         ['tutores', cuenta((u) => u.rol === 'tutor')],
         ['asesores', cuenta((u) => u.rol === 'asesor')],
         ['pendientes', cuenta((u) => u.estado !== 'activo')]
      ];
      datos.forEach(([clave, valor]) => {
         const nodo = root.querySelector('#gu-kpi-' + clave);
         if (nodo) nodo.textContent = valor;
         const pie = root.querySelector('#gu-kpi-' + clave + '-pct');
         if (pie) pie.textContent = Math.round((valor / total) * 100) + '% del total';
      });
      $('#gu-total-pill').textContent = usuarios.length + ' usuarios registrados';
   }

   /* --- Selección en lote --- */
   const barraLote = $('#gu-bulk');
   const checkTodos = $('#gu-select-all');

   function actualizarSeleccion() {
      const visiblesIds = $$('.gu-check-row').map((c) => c.getAttribute('data-id'));
      const marcados = visiblesIds.filter((id) => seleccion.has(id));
      barraLote.hidden = seleccion.size === 0;
      $('#gu-selected-count').textContent = seleccion.size;
      if (checkTodos) {
         checkTodos.checked = visiblesIds.length > 0 && marcados.length === visiblesIds.length;
         checkTodos.indeterminate = marcados.length > 0 && marcados.length < visiblesIds.length;
      }
   }

   if (checkTodos) {
      checkTodos.addEventListener('change', () => {
         $$('.gu-check-row').forEach((c) => {
            const id = c.getAttribute('data-id');
            if (checkTodos.checked) seleccion.add(id); else seleccion.delete(id);
         });
         pintarListado();
      });
   }

   root.addEventListener('change', (e) => {
      if (!e.target.classList.contains('gu-check-row')) return;
      const id = e.target.getAttribute('data-id');
      if (e.target.checked) seleccion.add(id); else seleccion.delete(id);
      $$('.gu-check-row[data-id="' + id + '"]').forEach((c) => { c.checked = e.target.checked; });
      actualizarSeleccion();
   });

   $$('.gu-bulk-actions button').forEach((btn) => {
      btn.addEventListener('click', () => {
         const accion = btn.getAttribute('data-bulk');
         if (accion === 'cancelar') {
            seleccion.clear();
            return pintarListado();
         }
         if (accion === 'eliminar') {
            return confirmar(
               'Eliminar ' + seleccion.size + ' usuario(s)',
               'Se quitarán del listado junto con sus credenciales. Esta acción no se puede deshacer.',
               () => {
                  usuarios = usuarios.filter((u) => !seleccion.has(u.id));
                  seleccion.clear();
                  pintarListado();
               }
            );
         }
         const nuevo = accion === 'activar' ? 'activo' : 'inactivo';
         usuarios.forEach((u) => { if (seleccion.has(u.id)) u.estado = nuevo; });
         seleccion.clear();
         pintarListado();
      });
   });

   /* --- Acciones por fila --- */
   root.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (btn && root.contains(btn)) {
         const u = usuarios.find((x) => x.id === btn.getAttribute('data-id'));
         if (!u) return;
         const accion = btn.getAttribute('data-act');
         if (accion === 'ver') return abrirCredencial(u);
         if (accion === 'editar') return editarUsuario(u);
         if (accion === 'eliminar') {
            return confirmar('Eliminar a ' + nombreCompleto(u), 'El usuario perderá el acceso al portal y saldrá del listado.', () => {
               usuarios = usuarios.filter((x) => x.id !== u.id);
               seleccion.delete(u.id);
               pintarListado();
            });
         }
      }

      const pag = e.target.closest('[data-page]');
      if (pag && root.contains(pag)) {
         const valor = pag.getAttribute('data-page');
         const total = Math.max(Math.ceil(filtrados().length / (parseInt(selectFilas.value, 10) || 10)), 1);
         if (valor === 'prev') pagina = Math.max(1, pagina - 1);
         else if (valor === 'next') pagina = Math.min(total, pagina + 1);
         else pagina = parseInt(valor, 10);
         return pintarListado();
      }

      manejarTarjeta(e);
   });

   /* Los modales viven fuera de <main>, así que necesitan su propio oyente. */
   function manejarTarjeta(e) {
      const verPass = e.target.closest('[data-gu-verpass]');
      if (verPass) {
         if (preview.contains(verPass)) {
            passVisible = !passVisible;
            return pintarPrevia();
         }
         const salida = verPass.closest('.gu-cred-pass').querySelector('output');
         const icono = verPass.querySelector('i');
         const oculto = icono.classList.contains('fa-eye-slash');
         salida.textContent = oculto ? (salida.getAttribute('data-real') || '') : '•'.repeat(8);
         icono.classList.toggle('fa-eye-slash', !oculto);
         icono.classList.toggle('fa-eye', oculto);
         return;
      }

      const bitacora = e.target.closest('[data-gu-bitacora]');
      if (bitacora) {
         cerrarModales();
         const enlace = document.querySelector('.app-nav-link[href="#practica"]');
         if (enlace) enlace.click();
      }
   }

   [inputBuscar, filtroRol, filtroEstado, selectFilas].forEach((el) => {
      el.addEventListener('input', () => { pagina = 1; pintarListado(); });
      el.addEventListener('change', () => { pagina = 1; pintarListado(); });
   });

   $('#gu-btn-clear').addEventListener('click', () => {
      inputBuscar.value = '';
      filtroRol.value = '';
      filtroEstado.value = '';
      sincronizarSelectPersonalizado(filtroRol);
      sincronizarSelectPersonalizado(filtroEstado);
      pagina = 1;
      pintarListado();
   });

   $('#gu-btn-nuevo').addEventListener('click', () => {
      limpiarFormulario();
      abrirPestana('gu-panel-registrar');
   });

   /* --- Editar --- */
   function editarUsuario(u) {
      editandoId = u.id;
      correoEditadoAMano = true;
      campos.nombres.value = u.nombres;
      campos.apellidos.value = u.apellidos;
      campos.docTipo.value = u.docTipo;
      campos.docNumero.value = u.docNumero;
      campos.correo.value = u.correo.replace(DOMINIO, '');
      campos.pass.value = u.pass;
      const radio = root.querySelector('input[name="gu-rol"][value="' + u.rol + '"]');
      if (radio) radio.checked = true;
      ajustarProgramaPorRol(u.rol);

      const existe = Array.from(campos.programa.options).some((o) => o.value === u.programa);
      if (!existe) {
         const opcion = document.createElement('option');
         opcion.value = u.programa;
         opcion.textContent = u.programa;
         opcion.setAttribute('data-facultad', 'Facultad de Educación y Humanidades');
         campos.programa.appendChild(opcion);
      }
      campos.programa.value = u.programa;
      sincronizarFacultad();
      sincronizarSelectPersonalizado(campos.docTipo);
      sincronizarSelectPersonalizado(campos.programa);

      estadoCuenta = u.estado;
      $$('.gu-switch button').forEach((b) => b.classList.toggle('is-on', b.getAttribute('data-estado') === u.estado));

      $('#gu-form-title').textContent = 'Editar usuario';
      $('#gu-form-desc').textContent = 'Revisa los cuatro pasos y guarda los cambios de ' + nombreCompleto(u) + '.';
      btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Guardar cambios';

      medirClave(u.pass);
      abrirPestana('gu-panel-registrar');
      mostrarPaso(1);
   }

   /* ======================================================================
      4. MODALES
      ====================================================================== */
   const modalCred = document.getElementById('gu-modal-credencial');
   const modalAviso = document.getElementById('gu-modal-aviso');
   const modalConfirmar = document.getElementById('gu-modal-confirmar');
   let accionConfirmada = null;

   function cerrarModales() {
      [modalCred, modalAviso, modalConfirmar].forEach((m) => { if (m) m.style.display = 'none'; });
   }

   function abrirCredencial(u) {
      const cuerpo = document.getElementById('gu-modal-credencial-body');
      if (cuerpo) cuerpo.innerHTML = plantillaCredencial(u, false);
      const salida = modalCred ? modalCred.querySelector('.gu-cred-pass output') : null;
      if (salida) salida.setAttribute('data-real', u.pass);
      if (modalCred) modalCred.style.display = 'flex';
   }

   function avisar(titulo, mensaje) {
      const tituloNodo = document.getElementById('gu-aviso-titulo');
      const textoNodo = document.getElementById('gu-aviso-texto');
      if (tituloNodo) tituloNodo.textContent = titulo;
      if (textoNodo) textoNodo.textContent = mensaje;
      if (modalAviso) modalAviso.style.display = 'flex';
   }

   function confirmar(titulo, mensaje, alAceptar) {
      const tituloNodo = document.getElementById('gu-confirmar-titulo');
      const textoNodo = document.getElementById('gu-confirmar-texto');
      if (tituloNodo) tituloNodo.textContent = titulo;
      if (textoNodo) textoNodo.textContent = mensaje;
      accionConfirmada = alAceptar;
      if (modalConfirmar) modalConfirmar.style.display = 'flex';
   }

   document.querySelectorAll('[data-gu-cerrar]').forEach((btn) => btn.addEventListener('click', cerrarModales));
   const btnConfirmarSi = document.getElementById('gu-confirmar-si');
   if (btnConfirmarSi) {
      btnConfirmarSi.addEventListener('click', () => {
         if (typeof accionConfirmada === 'function') accionConfirmada();
         accionConfirmada = null;
         cerrarModales();
      });
   }

   [modalCred, modalAviso, modalConfirmar].forEach((m) => {
      if (!m) return;
      m.addEventListener('click', (e) => { if (e.target === m) cerrarModales(); });
   });

   if (modalCred) modalCred.addEventListener('click', manejarTarjeta);

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrarModales();
   });

   /* ======================================================================
      5. ARRANQUE
      ====================================================================== */
   sincronizarFacultad();
   ajustarProgramaPorRol('estudiante');
   medirClave(campos.pass.value);
   mostrarPaso(1);
   pintarListado();
})();
