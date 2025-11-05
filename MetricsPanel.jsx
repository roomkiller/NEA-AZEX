import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, CheckCircle, Cpu, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const data = Array.from({ length: 10 }, () => ({ v: Math.floor(Math.random() * 100) }));

const MetricCard = ({ icon, title, value, unit, children, colorClass }) => {
  const Icon = icon;
  return (
    <Card className="bg-gray-500/5 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass || 'text-gray-500'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}{unit}</div>
        {children}
      </CardContent>
    </Card>
  );
};

export default function MetricsPanel({ metrics = {} }) {
  const { 
    operationsPerMinute = 127, 
    successRate = 97, 
    activeModules = 24, 
    avgCpu = 42 
  } = metrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <MetricCard icon={Zap} title="Opérations/min" value={operationsPerMinute} colorClass="text-yellow-400">
          <div className="h-10 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="v" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetricCard>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <MetricCard icon={CheckCircle} title="Taux de Succès" value={successRate} unit="%" colorClass="text-green-400">
             <div className="h-10 w-10 mx-auto mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: successRate }]} startAngle={90} endAngle={450}>
                         <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background clockWise dataKey="value" cornerRadius={10} fill="#34d399" />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </MetricCard>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <MetricCard icon={SlidersHorizontal} title="Modules Actifs" value={activeModules} colorClass="text-blue-400" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <MetricCard icon={Cpu} title="Charge CPU Moy." value={avgCpu} unit="%" colorClass="text-red-400">
             <div className="h-10 w-10 mx-auto mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: avgCpu }]} startAngle={90} endAngle={450}>
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background clockWise dataKey="value" cornerRadius={10} fill="#f87171" />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
        </MetricCard>
      </motion.div>
    </div>
  );
}