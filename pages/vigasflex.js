import { useState } from 'react';
import { Formik,Form, Field } from 'formik'
import { VARILLAS } from '../constants'
import * as Yup from 'yup';
import Error from '../components/Error';
import Layout from '../components/Layout';


const Vigasflex = () => {
    
    //Cargando
    const [cargando, setCargando] = useState(false);
    const [reporte, setReporte] = useState({});
    //SUbmit todo el proceso
    
    const handelSubmit = (valores) =>{
        const {base, altura, fy, fc, recubrimiento, alfa, mu, avarilla} = valores;
        const k1 = 0.85 
        //Calculando.
        //Distancia efectiva
        let d_e = (altura - recubrimiento).toFixed(1)
        let d2 = d_e * d_e // Distancia efectiva al cuadrado
        let Rn = ((mu *1000000) /(alfa * base * d2)).toFixed(2)
        let Pr = (((k1 * fc)/fy) * (1 - Math.sqrt(1-((2*Rn)/(k1*fc))))).toFixed(4)  //Cuantia real
        let As = (Pr * base * d_e).toFixed(2) //Area de acero

        console.log(`distancia efectiva: ${d_e} \n D.E. al cuadrado: ${d2} \n cuantia R: ${Pr} \n area de acero: ${As}  `)

        let num_v = (As/ parseInt(avarilla)).toFixed(1)
        let numvRedondeado = Math.ceil(num_v)
        console.log(`Numero de varillas = ${num_v} \n Numero de varillas Final: ${numvRedondeado}`)

        //Chequeo de cuantia
        let P_min = (1.4 / fy).toFixed(4)
        let P_max = ((((k1 * fc * k1)/fy)) * (0.003/(0.003 + 0.004))).toFixed(4)

        console.log(`P min = ${P_min}\n P Max = ${P_max}`)

        if (P_min < Pr){
            console.log('Cumple con cuantia minima')
        }
        else{
            console.log('No cumple con cuantia minima')
        }

        if (P_max > Pr){
            console.log('Cumple con cuantia maxima')
        }
        else{
            console.log('No cumple con cuantia maxima')
        }

        //Calculando bloque de compresion

        let compresion = ((fy * d_e * Pr)/(0.85 * fc * k1)).toFixed(2)
        console.log(`Bloque de profundidad de compresion "C": ${compresion}`)

        //Calculando deformacion unitaria a tension (es)
        let es = (((0.003 * (d_e - compresion))/compresion)).toFixed(3)
        console.log(`deformacion unitaria a tension (es): ${es}`)

        if (es > 0.005){
            console.log('Si Trabaja a tension')
        }
        else{
            console.log('No trabaja a tension')
        }

        //Se calcula momento nominal
        let Mn = (((numvRedondeado* parseInt(avarilla)) )* fy * (d_e - ((k1 * compresion)/2))/1000000).toFixed(2)
        //Se calcula momento nominal mayorado
        let Mn_mayorado = ((alfa * Mn)).toFixed(2) 

        console.log(`Momento nominal: ${Mn}kN/m\nMomento nominal mayorado: ${Mn_mayorado}kN/m`)

        if (Mn_mayorado > mu){
            console.log('Cumple')
        }
        else{
            console.log('No Cumple')
        }
        
        setReporte({
            d_e, 
            Rn, 
            Pr, 
            As, 
            num_v, 
            numvRedondeado, 
            P_min, P_max, 
            compresion, 
            es, 
            Mn, 
            Mn_mayorado, 
            mu
        })
        setCargando(true)

       
    }


    const vigasSchema = Yup.object().shape({
        base: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        altura: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fy: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        fc: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        recubrimiento: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser poitivo'),
        alfa: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        mu: Yup.number().required('Este campo es obligatorio').positive('El numero debe ser positivo'),
        avarilla: Yup.number().required('Este campo es obligatorio')
    })


    //Validando el formulario
    return (
        <Layout
            page='Vigas a Flexión'
        >
            <div >
                <h2
                    className=' text-center text-gray-900 text-4xl font-bold mt-3 font-mono'
                    >LEA BIEN ANTES DE USAR EL PROGRAMA 
                </h2>

                <Formik
                    initialValues={{
                        base: 0,
                        altura: 0,
                        fy: 0,
                        fc: 0,
                        recubrimiento: 0,
                        alfa: 0,
                        mu: 0,
                        avarilla:  "32"
                    }}

                    onSubmit = {(values) => {
                        handelSubmit(values)                    
                    }}

                    validationSchema={vigasSchema}
                >
                    {({ errors, touched }) =>{

                        return(
                            <Form
                                className=' grid md:grid-cols-2 content-center gap-10'
                            >
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='base' 
                                        className=' block font-mono text-gray-900'
                                    >Base (mm): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='base'
                                        name='base'
                                    />
                                    {errors.base && touched.base ? (
                                        <Error>
                                            {errors.base}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='altura'
                                        className=' block font-mono text-gray-900'
                                    >Altura (mm): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='altura'
                                        name='altura'
                                    />
                                    {errors.altura && touched.altura ? (
                                        <Error>
                                            {errors.altura}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='fy'
                                        className=' block font-mono text-gray-900'
                                    >Fy (mpa): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='fy'
                                        name='fy'
                                    />
                                    {errors.fy && touched.fy ? (
                                        <Error>
                                            {errors.fy}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='fc'
                                        className=' block font-mono text-gray-900'
                                    >fc (mpa) K1 solo trabaja hasta 28 (mpa): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='fc'
                                        name='fc'
                                    />
                                    {errors.fc && touched.fc ? (
                                        <Error>
                                            {errors.fc}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='recubrimiento'
                                        className=' block font-mono text-gray-900'
                                    >Recubrimiento (mm): </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='recubrimiento'
                                        name='recubrimiento'
                                    />
                                    {errors.recubrimiento && touched.recubrimiento ? (
                                        <Error>
                                            {errors.recubrimiento}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='alfa'
                                        className=' block font-mono text-gray-900'
                                    >Alfa: </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='alfa'
                                        name='alfa'
                                    />
                                    {errors.alfa && touched.alfa ? (
                                        <Error>
                                            {errors.alfa}
                                        </Error>
                                    ): null}
                                </div>

                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='mu'
                                        className=' block font-mono text-gray-900'
                                    >Momento Último (Kn/m):  </label>
                                    <Field
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"
                                        type="number"
                                        id='mu'
                                        name='mu'
                                    />
                                    {errors.mu && touched.mu ? (
                                        <Error>
                                            {errors.mu}
                                        </Error>
                                    ): null}
                                </div>
                                
                                <div className=' mb-1 mt-1 mx-8 w-f'>
                                    <label htmlFor='avarilla' className=' block font-mono text-gray-900'>Area de la varilla (mm cuadrado): </label>
                                    <Field 
                                        name="avarilla" 
                                        id="avarilla"  
                                        as="select" 
                                        className="p-3 bg-gray-200 rounded-lg mb-2 w-full"                             
                                    >
                                        
                                        {VARILLAS.map(varilla =>(
                                            <option 
                                                key={varilla.id}    
                                                value={varilla.area}                                        
                                            >
                                                {varilla.nombre}
                                            </option>
                                        ))}
                                    </Field>

                                    {errors.avarilla && touched.avarilla ? (
                                        <Error>
                                            {errors.avarilla}
                                        </Error>
                                    ): null}
                                </div>
                                <div 
                                className=' flex flex-col content-center mb-1 mt-1 mx-8 w-f'>
                                    <input 
                                        type="submit" 
                                        value="Diseñar" 
                                        className='mx-5 mb-6 cursor-pointer mt-5, bg-blue-600 p-3 text-center text-white font-bold text-lg rounded-lg '
                                    />
                                </div>           
                            </Form>
                    )}}
                </Formik>    

                { cargando &&  (
                        <div 
                        className=' bg-slate-300 max-w-full mx-8 mt-2 mb-2 p-4 rounded-lg'
                    >
                        <h2 className="text-gray-800 font-mono font-bold text-4xl">Resumen</h2>
                        <p className="font-mono font-bold text-gray-900 text-lg m:text-xs">Distancia Efectiva: <span className=' text-red-700 font-normal'>{reporte.d_e} mm</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Resistencia nominal: <span className=' text-red-700 font-normal'>{reporte.Rn}</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cuantia Real: <span className=' text-red-700 font-normal'>{reporte.Pr} </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Area De Acero: <span className=' text-red-700 font-normal'>{reporte.As} mm^2</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Numero de varillas: <span className=' text-red-700 font-normal'>{reporte.num_v} unidades</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Numero de varillas final: <span className=' text-red-700 font-normal'>{reporte.numvRedondeado} unidades</span></p>
                        {/* Chequeo de cuantia */}
                        <p className="font-mono font-bold text-gray-900 text-lg">Cuantia Mínima(p_min): <span className=' text-red-700 font-normal'>{reporte.P_min} </span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Cuantia Máxima(p_max): <span className=' text-red-700 font-normal'>{reporte.P_max}</span></p>
                
                        
                        {reporte.P_min < reporte.Pr ?
                        <p className="font-mono font-bold text-gray-900 text-lg">Cumple con cuantia mínima</p>
                        :
                        <p className="font-mono font-bold text-gray-900 text-lg">No cumple con cuantia mínima</p>
                        }
                        
                        {reporte.P_max > reporte.Pr ?
                        <p className="font-mono font-bold text-gray-900 text-lg">Cumple con cuantia máxima</p>
                        :
                        <p className="font-mono font-bold text-gray-900 text-lg">No cumple con cuantia máxima</p>
                        }
                        
                        {/* //Calculando bloque de compresion */}
                        <p className="font-mono font-bold text-gray-900 text-lg">Profundidad de bloque de compresion: <span className=' text-red-700 font-normal'>{reporte.compresion} mm</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">deformacion unitaria a tension (es): <span className=' text-red-700 font-normal'>{reporte.es}</span></p>
                         
                        {reporte.es > 0.005?
                        <p className="font-mono font-bold text-gray-900 text-lg">Si trabaja a tension</p>
                        :
                        <p className="font-mono font-bold text-gray-900 text-lg">No trabaja a tension</p>
                        }
                
                
                        {/* //Momento */}
                        <p className="font-mono font-bold text-gray-900 text-lg">Momento Nominal: <span className=' text-red-700 font-normal'>{reporte.Mn} Kn/m</span></p>
                        <p className="font-mono font-bold text-gray-900 text-lg">Momento Nominal Mayorado: <span className=' text-red-700 font-normal'>{reporte.Mn_mayorado} Kn/m</span></p>
                
                        {reporte.Mn_mayorado > reporte.mu?
                        <p className="font-mono font-bold text-gray-900 text-lg">Cumple</p>
                        :
                        <p className="font-mono font-bold text-gray-900 text-lg">No Cumple</p>
                        }
                        
                    </div>
                )}    
            </div>
        </Layout>
    )
}

export default Vigasflex