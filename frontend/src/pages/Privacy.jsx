import React from 'react';

const Privacy = () => {
  return (
    <div className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-blue-400">
          🔒 Política de Privacidad
        </h1>

        <p className="text-gray-300 text-lg text-center mb-12">
          Última actualización: Octubre 2025
        </p>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-8">
          <p className="text-gray-200 text-lg leading-relaxed">
            En Hostreams valoramos y respetamos la privacidad de nuestros usuarios, clientes y visitantes. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos la información personal que nos proporcionas al utilizar nuestros servicios o visitar nuestro sitio web{' '}
            <a href="https://hostreams.com" className="text-blue-400 hover:underline">https://hostreams.com</a>.
          </p>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">1. Información que recopilamos</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Podemos recopilar los siguientes tipos de información:
            </p>
            <ul className="list-disc list-inside text-gray-200 text-lg leading-relaxed space-y-2 pl-4">
              <li>
                <span className="font-semibold">Datos personales:</span> nombre, dirección de correo electrónico, número de teléfono, nombre de la empresa o emisora, y cualquier otro dato necesario para la prestación del servicio.
              </li>
              <li>
                <span className="font-semibold">Datos técnicos:</span> dirección IP, tipo de navegador, sistema operativo, idioma y registros de actividad dentro del sitio.
              </li>
              <li>
                <span className="font-semibold">Información de pago:</span> procesada de forma segura a través de plataformas externas (como PayPal, MercadoLibre o Flow). Hostreams no almacena datos de tarjetas de crédito o débito.
              </li>
              <li>
                <span className="font-semibold">Datos de uso:</span> comportamiento dentro del panel o sitio web, para mejorar la experiencia de usuario y el rendimiento de nuestros servicios.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">2. Uso de la información</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              La información recopilada se utiliza para:
            </p>
            <ul className="list-disc list-inside text-gray-200 text-lg leading-relaxed space-y-2 pl-4">
              <li>Proveer y mantener los servicios contratados.</li>
              <li>Personalizar la experiencia del usuario.</li>
              <li>Procesar pagos y facturación.</li>
              <li>Enviar notificaciones sobre actualizaciones, mejoras o cambios de servicio.</li>
              <li>Brindar soporte técnico y atención al cliente.</li>
              <li>Cumplir con obligaciones legales o contractuales.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">3. Protección de la información</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Hostreams implementa medidas de seguridad técnicas y organizativas para proteger tus datos personales contra pérdida, acceso no autorizado, alteración o divulgación.
              El acceso a la información está restringido únicamente al personal autorizado que la necesita para desempeñar sus funciones.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">4. Cookies y tecnologías similares</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Nuestro sitio utiliza cookies para mejorar la experiencia de navegación, analizar el tráfico y recordar preferencias.
              Puedes configurar tu navegador para rechazar cookies, aunque esto podría afectar el funcionamiento de algunas partes del sitio.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">5. Compartición de información</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc list-inside text-gray-200 text-lg leading-relaxed space-y-2 pl-4">
              <li>Cuando es necesario para la correcta prestación de servicios (por ejemplo, proveedores de hosting, correo o pasarelas de pago).</li>
              <li>Cuando lo exija la ley o una autoridad competente.</li>
            </ul>
            <p className="text-gray-200 text-lg leading-relaxed mt-4">
              Todos nuestros proveedores externos cumplen con las normas internacionales de privacidad y protección de datos.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">6. Retención de datos</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Mantendremos tus datos personales solo durante el tiempo necesario para cumplir con los fines descritos en esta política o mientras mantengas una relación activa con Hostreams.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">7. Derechos del usuario</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-gray-200 text-lg leading-relaxed space-y-2 pl-4">
              <li>Acceder, rectificar o eliminar tus datos personales.</li>
              <li>Solicitar la limitación u oposición a su tratamiento.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="text-gray-200 text-lg leading-relaxed mt-4">
              Para ejercer estos derechos, puedes contactarnos a través del correo:{' '}
              <a href="mailto:contacto@hostreams.com" className="text-blue-400 hover:underline">contacto@hostreams.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">8. Cambios en esta política</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Podemos actualizar esta Política de Privacidad periódicamente. Cualquier cambio será publicado en esta misma página con la fecha de revisión correspondiente. Te recomendamos revisarla con frecuencia para mantenerte informado.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-4">9. Contacto</h2>
            <p className="text-gray-200 text-lg leading-relaxed mb-2">
              Si tienes preguntas o inquietudes sobre esta Política de Privacidad o sobre el tratamiento de tus datos, puedes comunicarte con nosotros en:
            </p>
            <ul className="list-disc list-inside text-gray-200 text-lg leading-relaxed space-y-1 pl-4">
              <li>📧{' '}
                <a href="mailto:contacto@hostreams.com" className="text-blue-400 hover:underline">contacto@hostreams.com</a>
              </li>
              <li>🌐{' '}
                <a href="https://hostreams.com" className="text-blue-400 hover:underline">https://hostreams.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
