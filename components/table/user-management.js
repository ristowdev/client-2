import React, { useEffect } from 'react'
import styled from 'styled-components'
import { usePagination, useSortBy, useTable } from 'react-table'
import { useLang } from '@hooks/useLang'
import { isArray } from 'underscore'

const renderPaginationButtons = (pageLength) => {
  let arr = []
  for (let i = 0; i < pageLength; i++) {
    arr.push(i)
  }

  return arr
}

const TableContainer = styled.div`
  position: relative;

  .table-data {
    position: relative;
    border-radius: 0 !important;
    @media (max-width: 991px) {
      max-height: 100vh;
    }
  }

  table {
    width: 100%;
    table-layout: auto !important;
  }

  .card-body {
    border-spacing: 0;
    width: 100%;
    overflow: auto;

    thead {
      border-top: 1px solid #e7ecf1;
      border-bottom: 1px solid #e7ecf1;

      th {
        white-space:nowrap;
        max-width:100%;
        
        @media(max-width: 991px) {
          min-width: 100px;
        }
      }
    }

    tbody {
      tr {
        background: #FFFFFF 0% 0% no-repeat padding-box;
        border-top: 0.6000000238418579px solid #D5D5D5;

        &:hover {
          background: #f3f4f6;
        }

        &:last-child {
          border-bottom: 0;
        }
      }
    }

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      position: sticky;
      top: 0;
      z-index: 50;
      text-align: center;
      color: black;
      font: normal normal 800 14px/18px Nunito Sans;
      text-transform: uppercase;
    }

    th,
    td {
      margin: 0;
      padding: 15px;
      @media (max-width: 991px) {
        padding: 12px;
      }

      &.loading {
        padding: 1.5rem;
      }

      :last-child {
        border-right: 0;
      }
    }

    tr.disabled {
      background-color: #253270;
      opacity: 0.2;
      color: white;
    }
  }
`

function UserManagementTable(
  {
    columns = [],
    data = [],
    totalPage = 0,
    totalItem = 0,
    children = null,
    loading = false,
    rowClassName = () => null,
    onChangePageIndex = () => null,
    pagging = false,
    linkedItems = false,
    fetchData = () => null,
    pageCount: controlledPageCount,
    hideTableHeader = false,
    showSecondTable = false,
  },
) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // data

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      children,
      initialState: { pageIndex: 0, pageSize: 20 },
      manualPagination: true,
      autoResetPage: false,
      pageCount: controlledPageCount,
    },
    useSortBy,
    usePagination,
  )

  const { lang } = useLang()

  useEffect(() => {
    onChangePageIndex(pageIndex + 1)
  }, [pageIndex])

  useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  const { translations: T } = useLang()

  // Render the UI for your table
  return (
    <TableContainer>
      <div className="card card-box">
        {/*table header is passed via props*/}
        {children}
        <div className="card-body">
          <table {...getTableProps()} style={{ tableLayout: 'fixed' }}>
            {!hideTableHeader && (
              <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    // Add the sorting props to control sorting. For this example
                    // we can add them into the header props
                    column.Header !== '-' && (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <span className="d-flex align-items-center">
                    <span className="mr-1">
                      <span className="d-block">
                        {column.render('Header')}
                      </span>
                      {column.secondHeader &&
                      <span style={{ font: 'normal normal 400 12px Poppins' }}>{column.secondHeader}</span>
                      }
                    </span>
                    {/*<span>*/}
                    {/*  {column.isSorted*/}
                    {/*    ? column.isSortedDesc*/}
                    {/*      ? <span style={{ fontSize: '8px' }}><i className="fa fa-chevron-down"></i></span>*/}
                    {/*      : <span style={{ fontSize: '8px' }}><i className="fa fa-chevron-up"></i></span>*/}
                    {/*    : renderSortingArrows()}*/}
                    {/*</span>*/}
                  </span>
                      </th>
                    )
                  ))}
                </tr>
              ))}
              </thead>
            )}
            <tbody {...getTableBodyProps()}>
            {page.map((row, idx) => {
              prepareRow(row)
              return (
                <>
                  <tr
                    {...row.getRowProps()}
                    className={rowClassName(row)}
                    data-toggle="collapse"
                    href={`#collapseExample-${idx}`}
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    {row.cells.map((cell) => (
                      !isArray(cell.value) && (
                        <td
                          className={lang === 'Heb' ? 'text-right' : 'text-left'}
                          {...cell.getCellProps()}
                          style={{ whiteSpace: 'no-wrap', maxWidth: '100%' }}
                        >
                          {cell.render('Cell')}
                        </td>
                      )
                    ))}
                  </tr>
                  {showSecondTable && (
                    <tr className="border-0 hover:bg-transparent collapse" id={`collapseExample-${idx}`}>
                      <td colSpan={7}>
                        <table className="mb-3 mx-auto" style={{ width: '700px' }}>
                          <thead>
                          <tr className="border-0 hover:bg-transparent">
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >

                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.IdField.Label']}
                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.NameField.Label']}
                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.RoleField.Label']}
                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.Active PlanField.Label']}
                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.TotalPatients.Label']}
                            </th>
                            <th
                              style={{ backgroundColor: '#D9D9D9' }}
                              className="border border-black p-2"
                            >
                              {T['Page.MembersManagement.BalanceField.Label']}
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          {row.cells.map((cell) => {
                            return (
                              cell.column.row && (cell.row.original?.clinics || []).map(item => (
                                <tr>
                                  <td className="border border-black p-2">
                                    {item.mini_image_url ? (
                                      <img className="mx-auto" src={item.mini_image_url}/>
                                    ) : (
                                      <div style={{ width: '64px', height: '64px', backgroundColor: '#d9d9d9' }}/>
                                    )}
                                  </td>
                                  <td className="text-center border border-black p-2">{item.id}</td>
                                  <td className="text-center border border-black p-2">{item.name}</td>
                                  <td className="text-center border border-black p-2">{T[item.role_trans_key]}</td>
                                  <td className="text-center border border-black p-2">{item.active_plan_name}</td>
                                  <td className="text-center border border-black p-2">{item.total_patients}</td>
                                  <td className="text-center border border-black p-2">{item.balance}</td>
                                </tr>
                              ))
                            )
                          })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
            {!loading && !data.length && (
              <tr>
                <td colSpan="10000" className="text-center">
                  <div className="lg:flex items-center justify-center w-full p-4 lg:text-center text-left">
                    <p className="m-0 text-info font-semibold">No data</p>
                  </div>
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="10000" className="p-4 loading text-center w-100">
                  <div className="d-flex justify-content-center algin-items-center">
                    <p className="m-0">Loading...</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
      {pagging &&
      <div className="pagination md:flex block justify-between items-center">
        <div className="md:mb-0 mb-5">
          <span>
          Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        </div>
        <div className="flex">
          <button className="mr-6" onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          {renderPaginationButtons(pageOptions.length).map((i) => (
            <button
              key={i}
              onClick={() => gotoPage(i)}
              className={`rounded mr-2 rounded-full w-10 h-10 flex items-center justify-center ${pageIndex === i ? 'bg-purple text-white' : 'text-grey border border-gray-400'}`}
            >
              <span className="m-0 p-0">{i + 1}</span>
            </button>
          ))}
          <button className={lang === 'Heb' ? 'mr-3' : 'ml-3'} onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      </div>
      }
    </TableContainer>
  )
}

export default React.memo(UserManagementTable)
