import type { FC } from 'react'
import { Fragment } from 'react'
import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { clsx } from 'clsx'

export const Breadcrumb: FC = () => {
  const { breadcrumbItems } = breadcrumbStore()
  const isLastItem = <T,>(index: number, array: T[]) =>
    index === array.length - 1

  return (
    <BreadcrumbContainer>
      <BreadcrumbList>
        {breadcrumbItems.map(({ id, name, url }, index, array) => (
          <Fragment key={id}>
            <BreadcrumbItem
              className={clsx({
                'hidden md:block': !isLastItem(index, array),
              })}
            >
              {!isLastItem(index, array) ? (
                <BreadcrumbLink href={url}>{name}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {!isLastItem(index, array) && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  )
}
