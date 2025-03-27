import { FC } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface PreparationStepsProps {
    preparation: {
        prePreparation: string[]
        preparation: string[]
        conservation: string[]
    }
}

export const PreparationSteps: FC<PreparationStepsProps> = ({ preparation }) => {
    const { prePreparation, preparation: preparationSteps, conservation } = preparation
    const hasSteps = prePreparation.length > 0 || preparationSteps.length > 0 || conservation.length > 0

    return (
        <Card className='border-border bg-card'>
            <CardHeader>
                <h2 className='text-primary text-2xl font-bold'>Proceso de elaboración</h2>
            </CardHeader>
            <CardContent>
                <div className='relative flex gap-1'>
                    <div className='flex-1 space-y-16'>
                        {/* Preelaboración */}
                        {prePreparation.length > 0 && (
                            <div className='transition-all duration-300'>
                                <h4 className='text-primary mb-4 text-lg font-semibold'>Preelaboración</h4>
                                <ul className='list-none space-y-3'>
                                    {prePreparation.map((step, index) => (
                                        <li key={index} className='text-primary/80 flex items-start gap-3'>
                                            <span className='text-primary mt-1'>•</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Elaboración */}
                        {preparationSteps.length > 0 && (
                            <div className='transition-all duration-300'>
                                <h4 className='text-primary mb-4 text-lg font-semibold'>Elaboración</h4>
                                <ul className='list-none space-y-3'>
                                    {preparationSteps.map((step, index) => (
                                        <li key={index} className='text-primary/80 flex items-start gap-3'>
                                            <span className='text-primary mt-1'>•</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Conservación */}
                        {conservation.length > 0 && (
                            <div className='transition-all duration-300'>
                                <h4 className='text-primary mb-4 text-lg font-semibold'>Conservación</h4>
                                <ul className='list-none space-y-3'>
                                    {conservation.map((step, index) => (
                                        <li key={index} className='text-primary/80 flex items-start gap-3'>
                                            <span className='text-primary mt-1'>•</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* No process steps message */}
                        {!hasSteps && (
                            <div className='text-primary/50 flex flex-col items-center justify-center py-8'>
                                <p>No hay pasos de elaboración definidos</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
