import Layout from '@/components/Layout';
import TabsMain from '@/components/TabsMain';
import api from '@/utils/api';
import { ChevronsUp, EyeIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useEffect, useState } from 'react';

function Review() {
  return (
    <Layout>
      <TabsMain
        tabs={[
          {
            label: 'Latest',
            value: 'latest',
            icon: <ChevronsUp size={16} />,
            children: <Latest />,
          },
        ]}
      />
    </Layout>
  );
}

export default Review;

interface Entry {
  TANGGAL: string;
  KATEGORI: string;
  KEPERLUAN: string;
  DESKRIPSI: string;
  BIAYA: string;
}

function Latest() {
  const [latestData, setLatestData] = useState<Entry[]>([]);
  const [loadGet, setLoadGet] = useState(false);

  const onGet = () => {
    setLoadGet(true);

    api
      .GetTask('latest')
      .then((response) => {
        const { data } = response.data;
        console.log(response);
        setLatestData(data);
      })
      .catch((error) => {
        console.log(error.message);
        console.log(error);
      })
      .finally(() => {
        setLoadGet(false);
      });
  };

  useEffect(() => {
    onGet();
  }, []);

  return (
    <div>
      <div className="flex flex-col w-full items-start justify-center p-2 text-white ">
        <Table>
          <TableCaption>Latest data Entries</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="text-white text-center ">Tanggal</TableHead>
              <TableHead className="text-white text-left">Deskripsi</TableHead>
              <TableHead className="text-white text-right">Biaya</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadGet ? (
              <TableRow>
                <TableCell colSpan={4}>
                  {' '}
                  <div className="flex justify-center">
                    <Loader2 className="animate-spin text-center" />
                  </div>
                </TableCell>

                <div className="w-full h-full "></div>
              </TableRow>
            ) : (
              latestData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(entry.TANGGAL).toLocaleDateString('id-ID', {
                      year: '2-digit',
                      month: '2-digit',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-left  inline-flex gap-2 ">
                    <span className=" truncate w-16 md:w-full">{entry.DESKRIPSI}</span>

                    <Popover>
                      <PopoverTrigger>
                        <EyeIcon size={16} />
                      </PopoverTrigger>
                      <PopoverContent className="w-full capitalize ">
                        <p className="font-normal">
                          Kategori:{' '}
                          <span className="font-semibold">{entry.KATEGORI} </span>
                        </p>
                        <p className="font-normal">
                          Keperluan:{' '}
                          <span className="font-semibold">{entry.KEPERLUAN} </span>
                        </p>
                        <p className="font-normal">
                          Deskripsi:{' '}
                          <span className="font-semibold">{entry.DESKRIPSI} </span>
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(parseInt(entry.BIAYA))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>{' '}
    </div>
  );
}
