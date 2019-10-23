import os

def dump():
    from sqlbag import S, temporary_database as temporary_db, load_sql_from_file
    from migra import Migration

    DB_URL_FUTURE = 'postgresql:///cuedev'

    with temporary_db() as DB_URL_CURRENT:

        with S(DB_URL_FUTURE) as s_current, S(DB_URL_CURRENT) as s_target:
            load_sql_from_file(s_target, './host.sql')

            m = Migration(s_target, s_current)
            m.set_safety(False)
            m.add_all_changes()

            if m.statements:
                print('THE FOLLOWING CHANGES ARE NOT IMMORTALISED:', end='\n\n')
                print(m.sql)
                print()
                os.system('pg_dump -s --no-comments --no-owner --no-acl --no-tablespaces postgresql:///cuedev | sed -e "/^--/d" > host.sql')
                if input('Dump Dev to host.sql?') == 'yes':
                    print('Dumping...')

                else:
                    print('Not applying.')
            else:
                print('Already synced.')

dump()
