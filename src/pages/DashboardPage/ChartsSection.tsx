import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { ChartCard } from '../../components/ui/ChartCard';
import type { MonthlyTrend, LicenseDistribution, PassRate } from '../../types';

interface ChartsSectionProps {
  monthlyTrend: MonthlyTrend[];
  licenseDistribution: LicenseDistribution[];
  passRates: PassRate[];
  pieColors: string[];
}

export function ChartsSection({ monthlyTrend, licenseDistribution, passRates, pieColors }: ChartsSectionProps) {
  return (
    <>
      <div className="charts-row">
        <ChartCard title="Monthly Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="hocVien" name="Students" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="baiThi" name="Exams" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="dat" name="Passed" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribution by License Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={licenseDistribution}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {licenseDistribution.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Pass Rate by License Category">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={passRates} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="hang" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="rate" name="Pass rate" fill="#fdb913" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </>
  );
}
