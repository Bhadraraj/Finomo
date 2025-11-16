'use client';

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';

const starStudents = [
  {
    id: 'PRE43178',
    name: 'Evelyn Harper',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    marks: 1185,
    percent: '98%',
    year: 2014,
  },
  {
    id: 'PRE43174',
    name: 'Diana Plenty',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    marks: 1165,
    percent: '91%',
    year: 2014,
    selected: true,
  },
  {
    id: 'PRE43187',
    name: 'John Millar',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    marks: 1175,
    percent: '92%',
    year: 2014,
  },
  {
    id: 'PRE45371',
    name: 'Miles Esther',
    avatar: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400',
    marks: 1180,
    percent: '93%',
    year: 2014,
  },
];

const StarStudentsTable = memo(function StarStudentsTable() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Star Students</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Marks</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Percent</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Year</th>
              </tr>
            </thead>
            <tbody>
              {starStudents.map((student, index) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox checked={student.selected} />
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{student.id}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{student.marks}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium">{student.percent}</td>
                  <td className="py-4 px-4 text-gray-600">{student.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
});

export default StarStudentsTable;