/**
 * GESTOR DE COLABORACIÓN Y SUGERENCIAS — ENCARDOMY BY SHAMINKET
 * Permite a alumnos aportar tareas, avisos o exámenes para materias con Sección B
 * y enviar opciones y sugerencias generales sobre el sitio.
 * Flujo: Botón -> Modal -> Validación -> WhatsApp Oficial (+52 55 7198 5641)
 */

(function (root) {
  'use strict';

  const WHATSAPP_OFICIAL = '525571985641';
  let modoActual = 'seccion-b'; // 'seccion-b' | 'sugerencia'

  function asegurarModalEnDOM() {
    let backdrop = document.getElementById('modal-seccion-b-backdrop');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'modal-seccion-b-backdrop';
    backdrop.className = 'section-modal-backdrop';
    backdrop.style.display = 'none';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-labelledby', 'secb-modal-title');

    backdrop.innerHTML = `
      <div class="section-modal-box" style="text-align:left; width:100%; max-width:460px; box-sizing:border-box; max-height:92vh; overflow-y:auto; padding:24px 22px; background:linear-gradient(165deg, rgba(62,28,107,0.96) 0%, rgba(27,11,46,0.98) 100%); border:1px solid var(--c-copal-border); border-radius:var(--radius-lg); box-shadow:var(--shadow-float);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span id="secb-modal-badge" style="font-size:var(--text-micro); color:var(--c-oro); font-weight:800; text-transform:uppercase; letter-spacing:0.08em;">
            Encardomy · Sección B
          </span>
          <button type="button" onclick="ColaboracionSeccionB.cerrar()" style="background:none; border:none; color:var(--c-hueso-tertiary); font-size:1.3rem; cursor:pointer; padding:4px;" aria-label="Cerrar modal (Esc)">✕</button>
        </div>

        <h3 id="secb-modal-title" style="font-size:var(--text-title2); font-weight:800; color:var(--c-hueso); margin:0 0 6px 0; line-height:1.2;">
          Aportar información de Sección B
        </h3>
        <p id="secb-modal-desc" style="font-size:var(--text-caption); color:var(--c-hueso-secondary); margin:0 0 16px 0; line-height:1.45;">
          Completa los datos correspondientes. Al presionar enviar, se generará el mensaje oficial listo para enviarse a WhatsApp.
        </p>

        <form id="form-colaboracion-seccion-b" onsubmit="ColaboracionSeccionB.enviar(event)" novalidate>
          <!-- 1. ASIGNATURA -->
          <div id="secb-group-asignatura" style="margin-bottom:14px;">
            <label for="secb-input-asignatura" id="secb-label-asignatura" style="font-size:var(--text-micro); color:var(--c-hueso-tertiary); font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">
              Asignatura *
            </label>
            <select id="secb-input-asignatura" class="form-control" style="width:100%; height:46px; border-radius:var(--radius-md); background:var(--c-morado-card); color:var(--c-hueso); border:1px solid var(--c-copal-line); padding:0 12px; font-size:var(--text-body); box-sizing:border-box; outline:none;" required>
              <option value="">Selecciona la materia...</option>
            </select>
            <div id="secb-error-asignatura" style="display:none; color:var(--c-papel-magenta); font-size:var(--text-micro); margin-top:4px; font-weight:700;">
              ⚠️ Selecciona la asignatura correspondiente.
            </div>
          </div>

          <!-- 2. NOMBRE DE LA PERSONA -->
          <div style="margin-bottom:14px;">
            <label for="secb-input-nombre" style="font-size:var(--text-micro); color:var(--c-hueso-tertiary); font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">
              Tu Nombre Completo *
            </label>
            <input type="text" id="secb-input-nombre" class="form-control" placeholder="Ej: García Martínez Carlos" style="width:100%; height:46px; border-radius:var(--radius-md); background:var(--c-morado-card); color:var(--c-hueso); border:1px solid var(--c-copal-line); padding:0 14px; font-size:var(--text-body); box-sizing:border-box; outline:none;" required autocomplete="name">
            <div id="secb-error-nombre" style="display:none; color:var(--c-papel-magenta); font-size:var(--text-micro); margin-top:4px; font-weight:700;">
              ⚠️ Por favor escribe tu nombre completo.
            </div>
          </div>

          <!-- 3. TIPO DE INFORMACIÓN -->
          <div style="margin-bottom:14px;">
            <label for="secb-input-tipo" style="font-size:var(--text-micro); color:var(--c-hueso-tertiary); font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">
              Tipo de Información *
            </label>
            <select id="secb-input-tipo" class="form-control" style="width:100%; height:46px; border-radius:var(--radius-md); background:var(--c-morado-card); color:var(--c-hueso); border:1px solid var(--c-copal-line); padding:0 12px; font-size:var(--text-body); box-sizing:border-box; outline:none;" required>
              <option value="">Selecciona el tipo...</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Tarea">Tarea</option>
              <option value="Aviso">Aviso</option>
              <option value="Examen">Examen</option>
            </select>
            <div id="secb-error-tipo" style="display:none; color:var(--c-papel-magenta); font-size:var(--text-micro); margin-top:4px; font-weight:700;">
              ⚠️ Selecciona exactamente si es Sugerencia, Tarea, Aviso o Examen.
            </div>
          </div>

          <!-- 4. INFORMACIÓN -->
          <div style="margin-bottom:16px;">
            <label for="secb-input-info" id="secb-label-info" style="font-size:var(--text-micro); color:var(--c-hueso-tertiary); font-weight:700; text-transform:uppercase; display:block; margin-bottom:4px;">
              Información o Sugerencia *
            </label>
            <textarea id="secb-input-info" class="form-control" rows="4" placeholder="Escribe aquí los detalles: instrucciones, fecha de entrega/examen, páginas del libro, sugerencias sobre el sitio..." style="width:100%; border-radius:var(--radius-md); background:var(--c-morado-card); color:var(--c-hueso); border:1px solid var(--c-copal-line); padding:12px 14px; font-size:var(--text-body); font-family:var(--font-family-body); line-height:1.45; box-sizing:border-box; resize:vertical; min-height:85px; outline:none;" required></textarea>
            <div id="secb-error-info" style="display:none; color:var(--c-papel-magenta); font-size:var(--text-micro); margin-top:4px; font-weight:700;">
              ⚠️ Escribe la información detallada que deseas proporcionar.
            </div>
          </div>

          <!-- FEEDBACK DE ESTADO -->
          <div id="secb-form-feedback" style="display:none; padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:var(--text-caption); line-height:1.45; box-sizing:border-box;"></div>

          <!-- VINCULACIÓN CON AVISO DE PRIVACIDAD (REQUISITO 19) -->
          <div id="secb-privacy-notice-link" style="margin-bottom:14px; font-size:var(--text-micro, 0.72rem); color:var(--c-hueso-tertiary); line-height:1.45; text-align:center;">
            Al enviar este formulario confirmas que has leído el <a id="secb-link-aviso-integral" href="legal/aviso-de-privacidad.html" target="_blank" rel="noopener noreferrer" style="color:var(--c-oro); font-weight:700; text-decoration:underline;">Aviso de Privacidad</a> (<a id="secb-link-aviso-simplificado" href="legal/aviso-privacidad-simplificado.html" target="_blank" rel="noopener noreferrer" style="color:var(--c-oro); text-decoration:underline;">versión simplificada</a>).
          </div>

          <!-- BOTONES -->
          <div style="display:flex; gap:10px;">
            <button type="button" class="section-pill-btn" onclick="ColaboracionSeccionB.cerrar()" style="flex:1; justify-content:center; height:46px;">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" style="flex:2; justify-content:center; background:#25D366; color:#0B0C10; font-weight:800; border:none; height:46px; border-radius:var(--radius-pill); cursor:pointer; font-size:var(--text-caption); display:inline-flex; align-items:center; gap:6px;">
              <span>💬 Enviar a WhatsApp ›</span>
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(backdrop);

    const esEnLegal = (typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('/legal/') !== -1);
    const linkIntegral = backdrop.querySelector ? backdrop.querySelector('#secb-link-aviso-integral') : null;
    const linkSimplificado = backdrop.querySelector ? backdrop.querySelector('#secb-link-aviso-simplificado') : null;
    if (linkIntegral && esEnLegal) linkIntegral.setAttribute('href', 'aviso-de-privacidad.html');
    if (linkSimplificado && esEnLegal) linkSimplificado.setAttribute('href', 'aviso-privacidad-simplificado.html');

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.style.display !== 'none') {
        ColaboracionSeccionB.cerrar();
      }
    });

    return backdrop;
  }

  function poblarSelectorMaterias(selectEl, selectedIdOrName, esModoSugerencia) {
    if (!selectEl) return;
    selectEl.innerHTML = '';

    if (esModoSugerencia) {
      const optGeneral = document.createElement('option');
      optGeneral.value = 'General';
      optGeneral.textContent = '💡 Sugerencia general sobre el sitio';
      selectEl.appendChild(optGeneral);

      const optGroup = document.createElement('optgroup');
      optGroup.label = 'O relaciona con una asignatura específica:';

      const todasLasMaterias = (typeof DataStore !== 'undefined' && typeof DataStore.getMaterias === 'function')
        ? DataStore.getMaterias()
        : [
            { id: 'matematicas', nombre: 'Matemáticas IV' },
            { id: 'fisica', nombre: 'Física III' },
            { id: 'lengua-espanola', nombre: 'Lengua Española' },
            { id: 'historia', nombre: 'Historia Universal III' },
            { id: 'logica', nombre: 'Lógica' },
            { id: 'geografia', nombre: 'Geografía' },
            { id: 'dibujo', nombre: 'Dibujo II' },
            { id: 'ingles', nombre: 'Lengua extranjera Inglés IV' },
            { id: 'orientacion-educativa', nombre: 'Orientación Educativa IV' },
            { id: 'informatica', nombre: 'Informática' },
            { id: 'genero-prevencion', nombre: 'Género y Prevención de Violencias' },
            { id: 'educacion-fisica', nombre: 'Educación Física IV' }
          ];

      todasLasMaterias.forEach(function (m) {
        const opt = document.createElement('option');
        opt.value = m.nombre;
        if (opt.dataset) { opt.dataset.materiaId = m.id; } else if (opt.setAttribute) { opt.setAttribute("data-materia-id", m.id); }
        opt.textContent = m.nombre;
        if (selectedIdOrName && (m.id === selectedIdOrName || m.nombre === selectedIdOrName)) {
          opt.selected = true;
        }
        optGroup.appendChild(opt);
      });
      selectEl.appendChild(optGroup);

      if (!selectedIdOrName || selectedIdOrName === 'General') {
        optGeneral.selected = true;
      }
    } else {
      selectEl.innerHTML = '<option value="">Selecciona la materia...</option>';
      const materiasSecB = (typeof DataStore !== 'undefined' && typeof DataStore.getMateriasConSeccionB === 'function')
        ? DataStore.getMateriasConSeccionB()
        : [
            { id: 'ingles', nombre: 'Lengua extranjera Inglés IV' },
            { id: 'dibujo', nombre: 'Dibujo II' },
            { id: 'orientacion-educativa', nombre: 'Orientación Educativa IV' }
          ];

      materiasSecB.forEach(function (m) {
        const opt = document.createElement('option');
        opt.value = m.nombre;
        if (opt.dataset) { opt.dataset.materiaId = m.id; } else if (opt.setAttribute) { opt.setAttribute("data-materia-id", m.id); }
        opt.textContent = m.nombre;
        if (selectedIdOrName && (m.id === selectedIdOrName || m.nombre === selectedIdOrName)) {
          opt.selected = true;
        }
        selectEl.appendChild(opt);
      });
    }
  }

  function configurarModo(modo, nombreMateria, materiaId) {
    modoActual = modo || 'seccion-b';
    const backdrop = asegurarModalEnDOM();
    const badge = document.getElementById('secb-modal-badge');
    const title = document.getElementById('secb-modal-title');
    const desc = document.getElementById('secb-modal-desc');
    const selectAsig = document.getElementById('secb-input-asignatura');
    const labelAsig = document.getElementById('secb-label-asignatura');
    const selectTipo = document.getElementById('secb-input-tipo');
    const labelInfo = document.getElementById('secb-label-info');
    const inputInfo = document.getElementById('secb-input-info');

    if (modoActual === 'sugerencia') {
      if (badge) badge.textContent = 'Encardomy · Opciones y Sugerencias';
      if (title) title.textContent = 'Opciones y sugerencias sobre el sitio';
      if (desc) desc.textContent = 'Envíanos tus ideas, propuestas de mejora o aportes para la renovación de Encardomy. ¡Tu opinión hace la diferencia!';
      if (labelAsig) labelAsig.innerHTML = 'Asignatura / Ámbito <span style="font-weight:normal; opacity:0.8;">(opcional si es sugerencia general)</span>';
      if (labelInfo) labelInfo.textContent = 'Sugerencia o información detallada *';
      if (inputInfo) inputInfo.placeholder = 'Explica aquí tu sugerencia, herramienta que te gustaría ver o comentario sobre el sitio...';

      poblarSelectorMaterias(selectAsig, materiaId || nombreMateria, true);

      if (selectTipo) {
        selectTipo.value = 'Sugerencia';
      }
    } else {
      if (badge) badge.textContent = 'Encardomy · Sección B';
      if (title) title.textContent = 'Aportar información de Sección B';
      if (desc) desc.textContent = 'Completa los datos correspondientes. Al presionar enviar, se generará el mensaje oficial listo para enviarse a WhatsApp.';
      if (labelAsig) labelAsig.textContent = 'Asignatura *';
      if (labelInfo) labelInfo.textContent = 'Información *';
      if (inputInfo) inputInfo.placeholder = 'Escribe aquí los detalles: instrucciones, fecha de entrega/examen, páginas del libro, observaciones del docente...';

      poblarSelectorMaterias(selectAsig, materiaId || nombreMateria, false);

      if (selectTipo && selectTipo.value === 'Sugerencia') {
        selectTipo.value = '';
      }
    }
  }

  function abrir(nombreMateria, materiaId) {
    configurarModo('seccion-b', nombreMateria, materiaId);
    mostrarModal();
  }

  function abrirSugerencias(opciones) {
    opciones = opciones || {};
    configurarModo('sugerencia', opciones.nombreMateria, opciones.materiaId);
    mostrarModal();
  }

  function mostrarModal() {
    const backdrop = asegurarModalEnDOM();
    ocultarErrores();
    const feedback = document.getElementById('secb-form-feedback');
    if (feedback) feedback.style.display = 'none';

    backdrop.style.display = 'flex';

    const nombreInput = document.getElementById('secb-input-nombre');
    if (nombreInput && !nombreInput.value && typeof nombreInput.focus === 'function') {
      nombreInput.focus();
    }
  }

  function cerrar() {
    const backdrop = document.getElementById('modal-seccion-b-backdrop');
    if (backdrop) {
      backdrop.style.display = 'none';
    }
  }

  function ocultarErrores() {
    ['asignatura', 'nombre', 'tipo', 'info'].forEach(function (campo) {
      const err = document.getElementById('secb-error-' + campo);
      const inp = document.getElementById('secb-input-' + campo);
      if (err) err.style.display = 'none';
      if (inp) inp.style.borderColor = 'var(--c-copal-line)';
    });
  }

  function enviar(event) {
    if (event && event.preventDefault) event.preventDefault();

    ocultarErrores();

    const inputAsignatura = document.getElementById('secb-input-asignatura');
    const inputNombre = document.getElementById('secb-input-nombre');
    const inputTipo = document.getElementById('secb-input-tipo');
    const inputInfo = document.getElementById('secb-input-info');
    const feedback = document.getElementById('secb-form-feedback');

    const asignatura = (inputAsignatura ? inputAsignatura.value : '').trim();
    const nombre = (inputNombre ? inputNombre.value : '').trim();
    const tipo = (inputTipo ? inputTipo.value : '').trim();
    const info = (inputInfo ? inputInfo.value : '').trim();

    let hayErrores = false;
    const camposFaltantes = [];

    const esModoSug = (modoActual === 'sugerencia');

    // En modo Sección B, la asignatura es estrictamente obligatoria
    if (!esModoSug && !asignatura) {
      hayErrores = true;
      camposFaltantes.push('Asignatura');
      mostrarError('asignatura');
    }

    // Nombre obligatorio en ambos casos
    if (!nombre) {
      hayErrores = true;
      camposFaltantes.push('Tu nombre');
      mostrarError('nombre');
    }

    // Tipo obligatorio
    const tiposValidos = ['Tarea', 'Aviso', 'Examen', 'Sugerencia'];
    if (!tipo || tiposValidos.indexOf(tipo) === -1) {
      hayErrores = true;
      camposFaltantes.push('Tipo de información');
      mostrarError('tipo');
    }

    // Información obligatoria en ambos casos
    if (!info) {
      hayErrores = true;
      camposFaltantes.push('Información');
      mostrarError('info');
    }

    if (hayErrores) {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(255, 42, 133, 0.18)';
        feedback.style.border = '1px solid var(--c-papel-magenta)';
        feedback.style.color = '#FFFFFF';
        feedback.innerHTML = `⚠️ <strong>Formulario incompleto:</strong> Por favor completa los campos requeridos (${camposFaltantes.join(', ')}).`;
      }
      return false;
    }

    let mensaje = '';

    if (esModoSug) {
      // Requisito 13: formato para sugerencias y opciones
      let lineaAsignatura = '';
      if (asignatura && asignatura !== 'General') {
        lineaAsignatura = `Asignatura: ${asignatura}\n`;
      } else {
        lineaAsignatura = `Asignatura: General del sitio\n`;
      }

      mensaje = 
`Nueva sugerencia / información

Nombre: ${nombre}
Tipo: ${tipo}
${lineaAsignatura}
Información:
${info}`;
    } else {
      // Modo Sección B (mantiene formato exacto solicitado previamente)
      mensaje = 
`Solicitud de información para sección B

Asignatura: ${asignatura}
Nombre: ${nombre}
Tipo: ${tipo}

Información:
${info}`;
    }

    const url = 'https://wa.me/' + WHATSAPP_OFICIAL + '?text=' + encodeURIComponent(mensaje);

    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.background = 'rgba(37, 211, 102, 0.18)';
      feedback.style.border = '1px solid #25D366';
      feedback.style.color = '#FFFFFF';
      feedback.innerHTML = `
        ✓ <strong>Información lista para enviarse por WhatsApp.</strong><br>
        Abriendo WhatsApp oficial (+52 55 7198 5641)...<br>
        <span style="font-size:0.85em; opacity:0.85;">Si la ventana no abre automáticamente, <a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--c-oro); font-weight:700; text-decoration:underline;">haz clic aquí para abrir WhatsApp directamente</a>.</span>
      `;
    }

    if (root.App415 && typeof root.App415.mostrarToast === 'function') {
      root.App415.mostrarToast('✓ Información lista para enviar por WhatsApp');
    } else if (root.TabletApp415 && typeof root.TabletApp415.mostrarToast === 'function') {
      root.TabletApp415.mostrarToast('✓ Información lista para enviar por WhatsApp');
    }

    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.location.href = url;
    }

    return false;
  }

  function mostrarError(campo) {
    const err = document.getElementById('secb-error-' + campo);
    const inp = document.getElementById('secb-input-' + campo);
    if (err) err.style.display = 'block';
    if (inp) inp.style.borderColor = 'var(--c-papel-magenta)';
  }

  const API = {
    abrir: abrir,
    abrirSugerencias: abrirSugerencias,
    abrirOpcionesYSugerencias: abrirSugerencias,
    cerrar: cerrar,
    enviar: enviar
  };

  root.ColaboracionSeccionB = API;
  if (typeof globalThis !== 'undefined') {
    globalThis.ColaboracionSeccionB = API;
  }

  if (root.App415) {
    root.App415.abrirModalSeccionB = abrir;
    root.App415.abrirModalSugerencias = abrirSugerencias;
    root.App415.cerrarModalSeccionB = cerrar;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
